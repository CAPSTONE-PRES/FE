import { useLocation, useNavigate } from "react-router-dom";
import "../styles/NewPresentation.css";
import Header from "../components/Header";
import BackButton from "../components/BackButton";
import { getStringedDate } from "../util/get-stringed-date";
import { useContext, useState } from "react";
import { DataContext, DataDispatchContext } from "../App";
import dateSelectArrow from "../assets/SVG_NewPresentation/date-select-arrow.svg";
import selectArrow from "../assets/SVG_NewPresentation/presenter-select-arrow.svg";
import FileUploadBox from "../components/FileUploadBox";
import TeamMemberListModal from "../components/TeamMemberListModal";
import DatePickerModal from "../components/DatePickerModal";
import useOutsideClick from "../hooks/useOutsideClick";
import api from "../api";
import { getIsoDateString } from "../util/getIsoDateString";
import { extractText, generateCue, generateQnA } from "../api/fileApi";
import LoadingScreen from "../components/LoadingScreen";

const NewPresentation = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { workspaceId, workspaceMemberList, workspaceName } = location.state;
  const { currentUser } = useContext(DataContext);
  // const { onCreatePresentation } = useContext(DataDispatchContext);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("00:00");
  const [minute, setMinute] = useState(5);
  const [second, setSecond] = useState(0);
  const [file, setFile] = useState(null);
  const [optionFile, setOptionFile] = useState(null);
  const [createdProjectId, setCreatedProjectId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [apiDone, setApiDone] = useState(false);

  const [presenter, setPresenter] = useState({
    memberId: currentUser?.id,
    memberName: currentUser?.username,
    memberEmail: currentUser?.email,
    memberProfileUrl: currentUser?.profileUrl,
  });

  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isPresenterModalOpen, setIsPresenterModalOpen] = useState(false);

  const isTeamProject = (workspaceMemberList?.length ?? 0) > 1;

  function isBtnValid() {
    return title !== "" && file;
  }

  useOutsideClick(".np-presenter-setting", () =>
    setIsPresenterModalOpen(false)
  );
  useOutsideClick(".np-date-btn, .DatePickerModal", () =>
    setIsDateModalOpen(false)
  );

  const handleAddPresentation = async () => {
    if (!isBtnValid()) return;
    setLoadingText("대본 카드 생성 중");
    setIsLoading(true);

    try {
      //0. dueDate 계산
      /**      const dueDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        parseInt(time.split(":")[0]),
        parseInt(time.split(":")[1])
      ).toISOString(); */

      //1. 발표 생성 요청
      const createBody = {
        title,
        dueDate: getIsoDateString(date), //dueDate?
        limitedTime: { minute: Number(minute), second: Number(second) },
        presenterId: presenter.memberId ?? null,
        // fileIds: optFileId ? [uploadedFileId, optFileId] : [uploadedFileId],
      };

      const createRes = await api.post(
        `/workspace/${workspaceId}/projects/create`,
        createBody
      );
      const { projectId } = createRes.data;
      console.log("프로젝트 생성 완료: ", projectId);

      setCreatedProjectId(projectId);

      //2. 파일 업로드
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await api.post(
        `/files/upload?uploaderId=${currentUser.id}&projectId=${projectId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const uploadedFileId = uploadRes.data.fileId;
      console.log("파일 업로드 성공: ", uploadedFileId);

      //[옵션]자료조사 파일 업로드
      // let optFileId = null;
      // if (optionFile) {
      //   const optForm = new FormData();
      //   optForm.append("file", optionFile);
      //   const optUploadRes = await api.post(
      //     `/files/upload?uploaderId=${currentUser.id}&projectId=${projectId}`,
      //     optForm,
      //     {
      //       headers: { "Content-Type": "multipart/form-data" },
      //     }
      //   );
      //   optFileId = optUploadRes.data.fileId;
      //   console.log("옵션 파일 업로드 성공: ", optFileId);
      // }

      //3. 파일에서 텍스트 추출
      await extractText(uploadedFileId);
      // if (optFileId) {
      //   await extractText(optFileId);
      // }

      //4. 큐카드 생성
      const cueRes = await generateCue(uploadedFileId);

      //5. qna 생성
      await generateQnA(uploadedFileId);

      //모든 api 완료 후
      setApiDone(true);
    } catch (err) {
      console.error("발표 생성 실패: ", err);
      setLoadingText("문제가 발생했습니다. 다시 시도해주세요.");
      setTimeout(() => setIsLoading(false), 600);
    }
  };

  return (
    <div className="NewPresentation">
      <Header />
      {isLoading ? (
        <LoadingScreen
          text={loadingText}
          duration={150}
          isComplete={apiDone}
          onComplete={() => {
            nav(`/presentation/${createdProjectId}`);
          }}
        />
      ) : (
        <>
          <section className="np-header">
            <BackButton
              onClick={() => {
                nav(-1);
              }}
            />
            <div className="np-title">
              <h2>{workspaceName}</h2>
              <input
                type="text"
                placeholder="발표 제목 입력"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>
          </section>
          <hr />

          <section className="np-settings">
            <div className="np-settings-column">
              <div className="np-setting">
                <span className="setting-label">발표 예정일</span>
                <input
                  type="text"
                  className="np-date"
                  value={getStringedDate(date) + " " + time}
                  readOnly
                />
                <div className="np-date-setting">
                  <button
                    className="np-date-btn"
                    onClick={() => setIsDateModalOpen(!isDateModalOpen)}
                  >
                    날짜 선택
                    <img src={dateSelectArrow} />
                  </button>
                  {isDateModalOpen && (
                    <DatePickerModal
                      date={date}
                      setDate={setDate}
                      time={time}
                      setTime={setTime}
                      onClose={() => setIsDateModalOpen(false)}
                    />
                  )}
                </div>
              </div>

              <div className="np-setting">
                <span className="setting-label">발표자</span>
                <div className="np-presenter-setting">
                  <img
                    src={presenter.memberProfileUrl}
                    className="np-presenter-avatar"
                  />
                  <span className="np-presenter-name">
                    {presenter.memberName +
                      `${presenter.memberId === currentUser.id ? "(You)" : ""}`}
                  </span>
                  {isTeamProject && (
                    <img
                      src={selectArrow}
                      className="np-presenter-select"
                      onClick={() =>
                        setIsPresenterModalOpen(!isPresenterModalOpen)
                      }
                    />
                  )}

                  {isPresenterModalOpen && (
                    <TeamMemberListModal
                      teamMembers={workspaceMemberList}
                      onSelect={(member) => {
                        setPresenter(member);
                        setIsPresenterModalOpen(false);
                      }}
                      variant="newPres"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="np-settings-column">
              {/* <div className="np-setting">
            <label className="np-checkbox">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => {
                  setIsChecked(e.target.checked);
                }}
              />
              <span>카카오톡으로 알림받기</span>
            </label>
            <span className="push-label">발표 1 일전</span>
            <span className="push-setting">변경</span>
          </div> */}

              <div className="np-setting">
                <span className="setting-label">발표 제한시간</span>
                <input
                  className="np-input-time"
                  type="number"
                  min="0"
                  value={minute}
                  onFocus={(e) => {
                    e.target.select();
                  }}
                  onChange={(e) => {
                    setMinute(e.target.value);
                  }}
                />
                <span className="setting-label">분</span>
                <input
                  className="np-input-time"
                  type="number"
                  min="0"
                  max="59"
                  value={second}
                  onFocus={(e) => {
                    e.target.select();
                  }}
                  onChange={(e) => {
                    setSecond(e.target.value);
                  }}
                />
                <span className="setting-label">초</span>
              </div>
            </div>
          </section>

          <section className="np-upload">
            <FileUploadBox
              title="발표 자료 업로드"
              fileTypes="pdf/pptx"
              subText="발표자료 파일을 드래그 앤 드롭하세요!"
              file={file}
              setFile={setFile}
            />
            <FileUploadBox
              title="[옵션] 자료조사 파일 업로드"
              fileTypes="pdf/docx/txt"
              subText="자료조사 취합 파일을 드래그 앤 드롭하세요!"
              optionalNote="* 발표를 준비하며 취합해 둔 자료조사 내용을 업로드 하면 조사한 내용을 바탕으로 세세한 자료 분석이 가능해요!"
              isOptional
              file={optionFile}
              setFile={setOptionFile}
            />
            <p className="upload-limit">
              *파일 1개당 최대 첨부용량은 30MB입니다.
            </p>
          </section>

          <div className="np-footer">
            <button
              className={`np-add-btn ${isBtnValid() ? "active" : ""}`}
              onClick={handleAddPresentation}
              disabled={!isBtnValid()}
            >
              발표자료 추가하기
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NewPresentation;
