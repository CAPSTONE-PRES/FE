import { useLocation, useNavigate } from "react-router-dom";
import "../styles/NewPresentation.css";
import Header from "../components/Header";
import BackButton from "../components/BackButton";
import { getStringedDate } from "../util/get-stringed-date";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../App";
import dateSelectArrow from "../assets/SVG_NewPresentation/date-select-arrow.svg";
import selectArrow from "../assets/SVG_NewPresentation/presenter-select-arrow.svg";
import FileUploadBox from "../components/FileUploadBox";
import TeamMemberListModal from "../components/TeamMemberListModal";
import DatePickerModal from "../components/DatePickerModal";
import useOutsideClick from "../hooks/useOutsideClick";
import { getIsoDateString } from "../util/getIsoDateString";
import {
  extractText,
  generateCue,
  generateQnA,
  uploadFile,
  uploadResource,
  deleteFile,
} from "../api/fileApi";
import LoadingScreen from "../components/LoadingScreen";
import {
  createProject,
  getProjectInfo,
  updateProject,
} from "../api/projectApi";

const NewPresentation = () => {
  const nav = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode ?? "create";

  const { workspaceId, workspaceMemberList, workspaceName } = location.state;
  const { currentUser } = useContext(DataContext);

  // edit 모드는 기존 프로젝트 정보 세팅
  const [projectId, setProjectId] = useState(location.state?.projectId ?? null);

  const [originalFileId, setOriginalFileId] = useState(
    location.state?.fileId ?? null
  );
  // const [originalFileName, setOriginalFileName] = useState(
  //   location.state?.fileName
  // );
  const [file, setFile] = useState(null); //업로드된 새 파일
  const [optionFile, setOptionFile] = useState(null);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("00:00");

  const [minute, setMinute] = useState(5);
  const [second, setSecond] = useState(0);

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

  //-----------------------------------------------------------------//

  //edit모드 진입 시 초기화
  useEffect(() => {
    if (mode !== "edit") return;

    // insufficient → edit 진입 시 fileId와 file이 전달될 수 있음
    if (location.state?.fileId) {
      setOriginalFileId(location.state.fileId);
    }

    // projectId가 있어야 서버에서 정보 조회 가능
    if (projectId) {
      fetchProjectInfo();
    }
  }, [mode, projectId]);

  const fetchProjectInfo = async () => {
    const info = await getProjectInfo(projectId);

    setTitle(info.projectTitle);
    setDate(new Date(info.dueDate));
    setMinute(info.limitTime.minute);
    setSecond(info.limitTime.second);
    // setOriginalFileName(info.fileNames?.[0]); // 필요 시
  };

  //버튼 활성화 조건
  function isBtnValid() {
    if (mode === "create") return title !== "" && file;
    if (mode === "edit") {
      return title !== "" && (file || originalFileId) && optionFile;
    }
  }

  useOutsideClick(".np-presenter-setting", () =>
    setIsPresenterModalOpen(false)
  );
  useOutsideClick(".np-date-btn, .DatePickerModal", () =>
    setIsDateModalOpen(false)
  );

  const getLimitedTimeString = (minute, second) => {
    const mm = String(minute).padStart(2, "0");
    const ss = String(second).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // const handleAddPresentation = async () => {
  //   if (!isBtnValid()) return;
  //   setLoadingText("대본 카드 생성 중");
  //   setIsLoading(true);

  //   try {
  //     //0. dueDate 계산
  //     /**      const dueDate = new Date(
  //       date.getFullYear(),
  //       date.getMonth(),
  //       date.getDate(),
  //       parseInt(time.split(":")[0]),
  //       parseInt(time.split(":")[1])
  //     ).toISOString(); */

  //     //1. 발표 생성 요청
  //     const createBody = {
  //       title,
  //       dueDate: getIsoDateString(date), //dueDate?
  //       limitedTime: { minute: Number(minute), second: Number(second) },
  //       presenterId: presenter.memberId ?? null,
  //       // fileIds: optFileId ? [uploadedFileId, optFileId] : [uploadedFileId],
  //     };

  //     const createRes = await createProject(workspaceId, createBody);
  //     // const createRes = await api.post(
  //     //   `/workspace/${workspaceId}/projects/create`,
  //     //   createBody
  //     // );
  //     const { projectId } = createRes;
  //     console.log("프로젝트 생성 완료: ", projectId);

  //     setCreatedProjectId(projectId);

  //     //2. 파일 업로드
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     const uploadRes = await uploadFile(currentUser.id, projectId, formData);

  //     // const uploadRes = await api.post(
  //     //   `/files/upload?uploaderId=${currentUser.id}&projectId=${projectId}`,
  //     //   formData,
  //     //   {
  //     //     headers: { "Content-Type": "multipart/form-data" },
  //     //   }
  //     // );

  //     const uploadedFileId = uploadRes.fileId;
  //     console.log("파일 업로드 성공: ", uploadedFileId);

  //     //[옵션]자료조사 파일 업로드
  //     let optFileId = null;
  //     if (optionFile) {
  //       const optForm = new FormData();
  //       optForm.append("file", optionFile);
  //       const optUploadRes = await uploadResource(
  //         currentUser.id,
  //         projectId,
  //         optForm
  //       );
  //       optFileId = optUploadRes.fileId;
  //       console.log("옵션 파일 업로드 성공: ", optFileId);
  //     }

  //     //3. 파일에서 텍스트 추출
  //     await extractText(uploadedFileId);

  //     //4. 큐카드 생성
  //     const cueRes = await generateCue(uploadedFileId);

  //     //5. qna 생성
  //     await generateQnA(uploadedFileId);

  //     //모든 api 완료 후
  //     setApiDone(true);
  //   } catch (err) {
  //     console.error("발표 생성 실패: ", err);
  //     setLoadingText("문제가 발생했습니다. 다시 시도해주세요.");
  //     setTimeout(() => setIsLoading(false), 600);
  //   }
  // };

  //생성
  const handleCreate = async () => {
    try {
      setIsLoading(true);
      setLoadingText("파일 업로드 중...");

      // 1. 프로젝트 생성
      const createBody = {
        title,
        dueDate: getIsoDateString(date),
        limitedTime: { minute, second },
        presenterId: presenter.memberId ?? null,
      };

      const createRes = await createProject(workspaceId, createBody);
      const newProjectId = createRes.projectId;
      setProjectId(newProjectId);
      console.log("프로젝트 생성 완료: ", newProjectId);

      // 2. 메인 발표자료 업로드
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await uploadFile(
        currentUser.id,
        newProjectId,
        formData
      );
      const mainFileId = uploadRes.fileId;
      console.log("파일 업로드 성공: ", mainFileId);

      // 3. 추가자료(optFile) 업로드 (있을 때만)
      let optFileId = null;
      if (optionFile) {
        const optForm = new FormData();
        optForm.append("file", optionFile);
        const optRes = await uploadResource(
          currentUser.id,
          newProjectId,
          optForm
        );
        optFileId = optRes.fileId;
        console.log("옵션 파일 업로드 성공: ", optFileId);
      }

      // 4. extract-text
      const extractRes = await extractText(mainFileId);
      const { isSufficient, insufficientSlidePreviews } = extractRes;

      // optFile이 없고 insufficient이면 insufficient 페이지로 이동
      if (!optFileId && !isSufficient) {
        return nav("/insufficient", {
          state: {
            projectId: newProjectId,
            file,
            fileId: mainFileId,
            insufficientSlidePreviews,
            workspaceId,
            workspaceName,
            workspaceMemberList,
          },
        });
      }

      // 5. generate cue + qna
      setLoadingText("대본 카드 생성 중...");
      await generateCue(mainFileId, optFileId ?? undefined);
      await generateQnA(mainFileId);

      setApiDone(true);
    } catch (e) {
      console.error(e);
      setLoadingText("오류가 발생했습니다");
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  //편집
  //createbody의 필드 중 변한 값이 있으면 updateProject~extract, 없으면 ???
  const handleEdit = async () => {
    try {
      setIsLoading(true);
      setLoadingText("파일 업로드 중...");

      // // 1. 프로젝트 정보 수정
      // await updateProject(projectId, {
      //   title,
      //   dueDate: getIsoDateString(date),
      //   // limitedTime: { minute, second },
      //   limitedTime: getLimitedTimeString(minute, second),
      //   presenterId: presenter.memberId ?? null,
      // });

      let mainFileId = originalFileId;

      // 2. 발표자료 파일을 수정했으면 재업로드
      if (file) {
        if (originalFileId) await deleteFile(originalFileId);

        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await uploadFile(currentUser.id, projectId, formData);
        mainFileId = uploadRes.fileId;

        const extractRes = await extractText(mainFileId);
        const { isSufficient, insufficientSlidePreviews } = extractRes;

        // edit 모드에서는 optFile 없으면 다음 단계로 못감
        if (!optionFile && !isSufficient) {
          return nav("/insufficient", {
            state: {
              projectId,
              file,
              fileId: mainFileId,
              insufficientSlidePreviews,
              workspaceId,
              workspaceName,
              workspaceMemberList,
            },
          });
        }
      }

      // 3. optFile은 반드시 있어야 함 (버튼도 disable해두는 것이 안전)
      let optFileId = null;
      if (optionFile) {
        const optForm = new FormData();
        optForm.append("file", optionFile);
        const optRes = await uploadResource(currentUser.id, projectId, optForm);
        optFileId = optRes.fileId;
        console.log("옵션 파일 업로드 완료:", optFileId);
      }

      // 4. generate cue + qna
      setLoadingText("대본 카드 생성 중...");
      await generateCue(mainFileId, optFileId);
      await generateQnA(mainFileId);

      setApiDone(true);
    } catch (e) {
      console.error(e);
      setLoadingText("문제가 발생했습니다");
      setTimeout(() => setIsLoading(false), 800);
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
            if (projectId) nav(`/presentation/${projectId}`);
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
              onClick={mode === "edit" ? handleEdit : handleCreate}
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
