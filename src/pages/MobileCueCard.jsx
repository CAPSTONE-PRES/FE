import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CueCard from "../components/CueCard";
import { getProjectInfo } from "../api/projectApi";
import "../styles/MobileCueCard.css";
import iconDots from "../assets/SVG_MobileCueCard/tabler_dots-circle-horizontal.svg";
import LoadingLogo from "../assets/SVG_MobileCueCard/LoadingLogo.svg";

const backendResponse = {
  fileId: 18,
  slides: [
    {
      slideNumber: 1,
      basic: [
        {
          section: 1,
          keyword: "인사말",
          text: "안녕하세요. 오늘 저희 팀은 'AI 발표 피드백 서비스'에 대해 발표하겠습니다. <🔍 청중 바라보기>",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "인사말",
          text: "발표 주제 설명.",
        },
      ],
      qrSlug: "3a4fcbca7c5d",
      qrUrl: "https://pres.app/cuecard/3a4fcbca7c5d",
    },
    {
      slideNumber: 2,
      basic: [
        {
          section: 1,
          keyword: "프레젠테이션 능력 향상의 중요함",
          text: "강의 전과 후, 발표하기 활동에 대한 학생 반응의 비교 분석 연구조사에서 대학생들이 발표의 중요성을 인지한다는 것을 알 수 있었습니다.",
        },
        {
          section: 2,
          keyword: "발표 경험 필요성 연구조사 사례",
          text: "정은주 연구에 따르면, 학생들은 발표 경험이 중요하다는 인식을 77.8%가 가지고 있으며, 앞으로의 생활에서도 발표 능력이 중요할 것이라는 인식이 84.4%에 달합니다. 이는 학생들이 발표하기에 대한 높은 관심을 반영하고 있습니다.",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "발표 능력 인식",
          text: "대학생들의 발표 능력 향상 필요성과 AI 발표 피드백 서비스의 중요성 강조",
        },
      ],
      qrSlug: "b02f71e5d7f4",
      qrUrl: "https://pres.app/cuecard/b02f71e5d7f4",
    },
    {
      slideNumber: 3,
      basic: [
        {
          section: 1,
          keyword: "대학생 발표 문제",
          text: "대학생들은 발표 과업에서 여러 가지 문제를 경험하고 있습니다. <🌬 호흡> 특히, 발표 연습과 실제 발표의 분위기가 너무 달라서 많은 학생들이 발표 연습을 빨리 끝내고 싶어하는 경향이 있습니다. <🔍 청중 바라보기> 이는 결국 현장에서 완성도 있는 발표를 하지 못하게 만드는 원인으로 작용합니다.",
        },
        {
          section: 2,
          keyword: "연습의 불균형",
          text: "많은 학생들이 발표 연습을 할 때, 처음 부분만 열심히 하고 뒷부분은 소홀히 하는 경향이 있습니다. <👉 화면 가리키기> 이로 인해 발표의 후반부에서 더 많은 실수를 하게 되는 경우가 발생합니다. <✋ 제스처> 특히 고학년 학생들은 발표 불안이 증가하는 경향이 있습니다.",
        },
        {
          section: 3,
          keyword: "저학년 발표 불안",
          text: "저학년 학생들도 비슷한 문제를 겪고 있습니다. <🌬 호흡> 발표 연습 시 실전 발표와의 차이를 줄이기 위해 노트북을 멀리 두고 연습하는 방법을 사용하기도 합니다. <👉 화면 가리키기> 그러나 이러한 노력에도 불구하고 발표 불안은 여전히 높습니다.",
        },
        {
          section: 4,
          keyword: "비언어적 표현의 어려움",
          text: "발표 연습 상황에서는 긴장으로 인해 비언어적 표현을 고려하기 어렵습니다. <🌬 호흡> 많은 학생들이 다음 내용을 생각하는 데 집중하게 되어, 시선 처리와 같은 비언어적 요소를 간과하게 됩니다. <🔍 청중 바라보기> 이는 발표의 질을 저하시킬 수 있습니다.",
        },
        {
          section: 5,
          keyword: "질의응답의 두려움",
          text: "예상치 못한 실수와 질의응답에 대한 두려움도 학생들에게 큰 부담이 됩니다. <👉 화면 가리키기> 이러한 불안 요소는 발표 준비 과정에서 실전 발표에 대한 자신감을 떨어뜨리는 요인이 됩니다. <✋ 제스처> 따라서, 실제 발표 상황과 유사한 연습 환경의 필요성이 강조됩니다.",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "대학생 발표 문제",
          text: "대학생들이 발표 연습과 실제 발표 간의 차이로 인해 발표 불안을 겪고 있으며, 이는 발표의 질에 영향을 미친다.",
        },
      ],
      qrSlug: "74c370eb8fc5",
      qrUrl: "https://pres.app/cuecard/74c370eb8fc5",
    },
    {
      slideNumber: 4,
      basic: [
        {
          section: 1,
          keyword: "서비스의 부재",
          text: "그러나 현존하는 서비스는 단기적인 발표 과업이 아닌 말하기 전반의 능력 향상이 목표로 대학생들이 발표를 진행할 때 문제라고 생각하는 점을 해결해줄 수 있는 서비스가 없습니다. <🔍 청중 바라보기> ",
        },
        {
          section: 2,
          keyword: "SayNow AI",
          text: "이제 SayNow AI에 대해 말씀드리겠습니다. <🌬 호흡> SayNow AI는 발표 연습 영상 업로드 기반의 AI 피드백 서비스입니다. <👉 화면 가리키기> 이 서비스는 사용자가 자신의 발표 영상을 업로드하면, AI가 피드백을 제공하여 발표 능력을 향상시킬 수 있도록 돕습니다.",
        },
        {
          section: 3,
          keyword: "Orai",
          text: "다음으로 Orai에 대해 소개하겠습니다. <🌬 호흡> Orai는 연설 훈련을 위한 AI 기반 솔루션입니다. <👉 화면 가리키기> 이 플랫폼은 사용자가 연설을 연습할 수 있도록 다양한 기능을 제공하며, 실시간 피드백을 통해 발표 능력을 개선할 수 있습니다.",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "프로젝트 배경",
          text: "대학생 발표 능력 향상을 위한 AI 기반 피드백 서비스 소개",
        },
      ],
      qrSlug: "0db81e687e23",
      qrUrl: "https://pres.app/cuecard/0db81e687e23",
    },
    {
      slideNumber: 5,
      basic: [
        {
          section: 1,
          keyword: "맥락 반영 부족",
          text: "하지만 현재의 AI 솔루션들은 PPT 발표자료를 보며 사람들 앞에서 내용을 설명하는 발표 상황에서의 맥락 반영이 부족합니다. <🔍 청중 바라보기> 이 점은 향후 개선이 필요한 부분입니다. <🌬 호흡>",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "발표 약점 해결",
          text: "대학생 발표 능력 향상을 위한 AI 기반 솔루션의 필요성과 현재 서비스의 한계 분석",
        },
      ],
      qrSlug: "fec041a97e55",
      qrUrl: "https://pres.app/cuecard/fec041a97e55",
    },
    {
      slideNumber: 6,
      basic: [
        {
          section: 1,
          keyword: "문제정의",
          text: "현재 발표를 준비하는 학생들은 혼자서 실전처럼 발표를 연습할 수 있는 체계적인 시스템이 부족합니다. 이러한 문제는 발표 능력 향상에 큰 장애물이 됩니다. <🌬 호흡> 따라서, 우리는 이 문제를 해결하기 위한 방안을 모색해야 합니다.",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "문제정의",
          text: "혼자서도 실전처럼 발표할 수 있는 체계적인 시스템의 필요성 및 AI 발표 피드백 서비스 소개",
        },
      ],
      qrSlug: "f0550671b414",
      qrUrl: "https://pres.app/cuecard/f0550671b414",
    },
    {
      slideNumber: 7,
      basic: [
        {
          section: 1,
          keyword: "사용자 가치",
          text: "저희 서비스의 사용자 가치는 최종 발표 완성도를 높이고자 하는 대학생의 욕구 해소입니다. <🔍 청중 바라보기>",
        },
        {
          section: 2,
          keyword: "욕구 해소 방법",
          text: "발표 완성도를 높이고 싶은 대학생에게 부족한 부분을 판단할 수 있는 피드백을 제공하여 발표 과업을 꼽꼽하게 꼼꼼하게 수행할 수 있도록 돕는 것이 이 서비스의 주요 기능입니다. <🌬 호흡> 이를 통해 최종 발표의 완성도를 올리고자 하는 욕구를 해소할 수 있습니다. <🔍 청중 바라보기>",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "사용자 가치",
          text: "AI 발표 피드백 서비스는 대학생의 발표 완성도를 높이기 위한 피드백 제공을 목표로 한다.",
        },
      ],
      qrSlug: "0683cd76cba1",
      qrUrl: "https://pres.app/cuecard/0683cd76cba1",
    },
    {
      slideNumber: 8,
      basic: [
        {
          section: 1,
          keyword: "서비스 컨셉",
          text: "대학생들, AI랑 연습하며 발표점수 만점 받자! <👉 화면 가리키기> ",
        },
        {
          section: 2,
          keyword: "기능 설명",
          text: "발표 수업에서 발표 점수 만큼은 A+받을 수 있도록, 자연스럽고 전달력 있는 발표로 마무리 할 수 있도록 Pres가 도와드릴게요. <🔍 청중 바라보기> ",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "서비스 개요",
          text: "AI 기반 발표 피드백 서비스의 개요와 효과에 대한 설명",
        },
      ],
      qrSlug: "fef3514400bb",
      qrUrl: "https://pres.app/cuecard/fef3514400bb",
    },
    {
      slideNumber: 9,
      basic: [
        {
          section: 1,
          keyword: "주요 기능",
          text: "발표의 가치에 따른 주요 기능에 대해 설명드리겠습니다. <🌬 호흡> 팀원들과 내용을 쉽게 공유할 수 있는 기능이 포함되어 있습니다. <👉 화면 가리키기> 이를 통해 최종 발표의 완성도를 최대화할 수 있습니다.",
        },
        {
          section: 2,
          keyword: "자동 대본 작성",
          text: "발표 연습 시간을 늘릴 수 있도록 자동 대본 작성을 돕습니다. <📄 발표자료 보기> 수정 가능한 발표 대본 자동 생성하여 제공됩니다.",
        },
        {
          section: 3,
          keyword: "발표 실전 훈련",
          text: "발표 환경과 더 유사하게 연습 모드가 제공되며 디바이스 분리로 모바일 대본을 제공 연습모드를 통해 시간 측정까지 진행합니다. ",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "주요 기능",
          text: "AI 발표 피드백 서비스의 주요 기능과 발표 완성도를 높이는 방법 설명",
        },
      ],
      qrSlug: "15e07f8bca3e",
      qrUrl: "https://pres.app/cuecard/15e07f8bca3e",
    },
    {
      slideNumber: 10,
      basic: [
        {
          section: 1,
          keyword: "발화 속도",
          text: "발화 속도는 적정 속도인 330에서 370 SPM을 기준으로 평가합니다. <🔍 청중 바라보기> STT 변환 결과에서 텍스트의 음절 개수를 합산하여 분당 음절 수로 계산합니다. <🌬 호흡> 이와 관련된 연구 결과를 통해 발화 속도의 중요성을 확인할 수 있습니다.",
        },
        {
          section: 2,
          keyword: "말의 반복",
          text: "말의 반복은 20초 단위로 동일한 단어가 3회 이상 반복될 경우 판단됩니다. <👉 화면 가리키기> 핵심어는 반복 감지 대상에서 제외하여 불필요한 피드백을 최소화하는 방법을 사용합니다. <✋ 제스처> 이러한 기준은 발표의 흐름을 원활하게 유지하는 데 기여합니다.",
        },
        {
          section: 3,
          keyword: "발표 정확도",
          text: "발표 정확도는 발표 스크립트와의 문장 유사도 및 핵심 키워드 포함률을 기반으로 측정됩니다. <📄 발표자료 보기> 이는 발표자가 얼마나 정확하게 내용을 전달하고 있는지를 평가하는 중요한 지표입니다. <🌬 호흡> 발표의 질을 높이기 위해서는 이 지표를 지속적으로 모니터링해야 합니다.",
        },
        {
          section: 4,
          keyword: "말의 망설임",
          text: "말의 망설임은 추임새와 같은 Filling Word를 기반으로 감지됩니다. <🔍 청중 바라보기> 공백 단어 간 시간 간격이 2.5초 이상이거나 음량이 기준 이하로 유지되면 무음으로 인식하여 공백을 판단합니다. <👉 화면 가리키기> 이러한 요소들은 발표의 자연스러움에 영향을 미칩니다.",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "발화 속도",
          text: "발표의 품질을 평가하기 위한 주요 항목으로 발화 속도, 말의 반복, 발표 정확도, 말의 망설임을 소개한다.",
        },
      ],
      qrSlug: "179e33273dbe",
      qrUrl: "https://pres.app/cuecard/179e33273dbe",
    },
    {
      slideNumber: 11,
      basic: [
        {
          section: 1,
          keyword: "생동감&투명함",
          text: "디자인 컨셉은 생동감과 투명함을 강조합니다. <🌬 호흡> 맑고 투명한 푸른색 계열의 색상들은 사용자에게 신뢰감과 집중력을 제공하며, 시각적으로 정리된 느낌을 줍니다. <👉 화면 가리키기> 또한, 브라이트 계열 색상은 생동감을 더해줍니다.",
        },
        {
          section: 2,
          keyword: "색상 조합",
          text: "이러한 색상 조합은 사용자 경험을 향상시키는 데 중요한 역할을 합니다. <🔍 청중 바라보기>",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "생동감&투명함",
          text: "디자인 컨셉의 핵심은 생동감과 투명함을 통해 신뢰감과 집중력을 제공하는 것입니다.",
        },
      ],
      qrSlug: "b02c9b85b7f8",
      qrUrl: "https://pres.app/cuecard/b02c9b85b7f8",
    },
    {
      slideNumber: 12,
      basic: [
        {
          section: 1,
          keyword: "워크 스페이스 생성",
          text: "워크 스페이스 생성은 AI 발표 피드백 서비스의 첫 단계입니다. <🌬 호흡> 사용자는 홈 화면에서 클래스를 생성하고, 수업의 이름과 요일, 시간을 입력해야 합니다. <👉 화면 가리키기> 이 과정을 통해 수업에 대한 기본 정보를 설정할 수 있습니다.",
        },
        {
          section: 2,
          keyword: "수업 정보 입력",
          text: "수업의 이름은 해당 수업을 쉽게 식별할 수 있도록 명확하게 작성해야 합니다. <🔍 청중 바라보기> 요일과 시간은 수업 일정에 맞춰 정확하게 입력하는 것이 중요합니다. <✋ 제스처> 이러한 정보는 이후 피드백 과정에 필수적인 역할을 합니다.",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "워크 스페이스 생성",
          text: "AI 발표 피드백 서비스의 첫 단계인 워크 스페이스 생성 방법 설명",
        },
      ],
      qrSlug: "03c3a854212b",
      qrUrl: "https://pres.app/cuecard/03c3a854212b",
    },
    {
      slideNumber: 13,
      basic: [
        {
          section: 1,
          keyword: "발표 자료 업로드",
          text: "발표자는 발표 자료를 업로드하기 위해 발표 예정일과 발표 알림을 선택해야 합니다. 또한 발표 제한시간과 발표자를 지정하는 과정이 필요합니다. <👉 화면 가리키기> 이러한 단계는 발표의 원활한 진행을 위해 필수적입니다. <🌬 호흡> 다음으로, 자료 업로드 방법에 대해 자세히 설명드리겠습니다.",
        },
        {
          section: 2,
          keyword: "파일 형식",
          text: "업로드할 파일 형식은 PDF 또는 PPTX로 제한됩니다. 이는 시스템의 호환성을 유지하기 위한 조치입니다. <📄 발표자료 보기> 따라서 발표자는 해당 형식에 맞춰 자료를 준비해야 합니다. <✋ 제스처> 이어서 발표 자료의 관리 방법에 대해 말씀드리겠습니다.",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "발표 자료 업로드",
          text: "발표 자료 업로드 및 피드백 서비스의 중요성 설명",
        },
      ],
      qrSlug: "2e21777112fa",
      qrUrl: "https://pres.app/cuecard/2e21777112fa",
    },
    {
      slideNumber: 14,
      basic: [
        {
          section: 1,
          keyword: "자동 대본 생성",
          text: "발표 대본은 자동으로 생성되어 스플릿뷰로 제공됩니다. <👉 화면 가리키기> 이 기능은 발표자가 대본을 쉽게 확인하고 수정할 수 있도록 돕습니다. <🌬 호흡>",
        },
        {
          section: 2,
          keyword: "수정 가능",
          text: "발표자는 생성된 대본을 바탕으로 부족한 내용이나 추가하고 싶은 내용을 자유롭게 입력할 수 있습니다. <🔍 청중 바라보기> 이를 통해 발표의 품질을 높이고, 개인의 스타일에 맞게 조정할 수 있습니다. <✋ 제스처>",
        },
        {
          section: 3,
          keyword: "비언어적 표현",
          text: "비언어적 표현은 발표자가 자연스럽고 직관적으로 행동할 수 있도록 가이드를 제공합니다. <🌬 호흡> 이러한 태그는 발표 중에 적절한 시점에 활용될 수 있습니다. <👉 화면 가리키기>",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "자동 대본 생성",
          text: "AI 발표 피드백 서비스의 자동 대본 생성 및 비언어적 표현 활용 설명",
        },
      ],
      qrSlug: "2bd54cc6be85",
      qrUrl: "https://pres.app/cuecard/2bd54cc6be85",
    },
    {
      slideNumber: 15,
      basic: [
        {
          section: 1,
          keyword: "자동 대본 생성",
          text: "발표 대본 생성 단계에서는 자동으로 생성된 대본이 스플릿뷰 형식으로 제공됩니다. <👉 화면 가리키기> 이 대본은 발표자가 필요에 따라 수정할 수 있으며, 부족한 내용이나 추가하고 싶은 내용을 자유롭게 입력할 수 있습니다. <🌬 호흡>",
        },
        {
          section: 2,
          keyword: "비언어적 표현",
          text: "비언어적 표현은 발표자가 보다 직관적이고 자연스럽게 행동할 수 있도록 돕는 가이드 역할을 합니다. <✋ 제스처> 이러한 태그는 발표자가 청중과의 소통을 원활하게 하고, 발표의 흐름을 개선하는 데 기여합니다. <🔍 청중 바라보기>",
        },
        {
          section: 3,
          keyword: "검토의견",
          text: "팀원들은 발표 대본에 대한 검토의견을 코멘트 형태로 남길 수 있습니다. <📄 발표자료 보기> 이를 통해 팀원 간의 피드백을 효과적으로 반영할 수 있으며, 발표의 완성도를 높이는 데 중요한 역할을 합니다. <🌬 호흡>",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "자동 대본 생성",
          text: "발표 대본 생성 및 비언어적 표현의 중요성과 팀원 피드백 기능 설명",
        },
      ],
      qrSlug: "1768fb968204",
      qrUrl: "https://pres.app/cuecard/1768fb968204",
    },
    {
      slideNumber: 16,
      basic: [
        {
          section: 1,
          keyword: "연습 모드",
          text: "연습 모드는 실제 발표 상황을 대비할 수 있는 중요한 기능입니다. 이 기능을 통해 사용자는 발표를 미리 연습하여 자신감을 높일 수 있습니다. <🌬 호흡> 이제 연습 모드의 주요 기능인 타이머 설정에 대해 설명드리겠습니다.",
        },
        {
          section: 2,
          keyword: "타이머 설정",
          text: "타이머 설정은 클래스 생성 시 입력했던 발표 제한 시간을 기준으로 제공됩니다. 이 기능은 발표자가 시간 관리 능력을 향상시키는 데 도움을 줍니다. <👉 화면 가리키기> 다음으로, 연습 모드의 효과에 대해 논의하겠습니다.",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "연습 모드",
          text: "AI 발표 피드백 서비스의 연습 모드와 타이머 설정 기능 설명",
        },
      ],
      qrSlug: "070ee4d69e46",
      qrUrl: "https://pres.app/cuecard/070ee4d69e46",
    },
    {
      slideNumber: 17,
      basic: [
        {
          section: 1,
          keyword: "연습 모드",
          text: "연습 모드는 실제 발표 상황을 대비할 수 있는 기능입니다. 이를 통해 발표자는 자신감을 가지고 발표를 준비할 수 있습니다. <🌬 호흡> 다음으로, 타이머 설정 기능에 대해 설명드리겠습니다.",
        },
        {
          section: 2,
          keyword: "타이머 설정",
          text: "타이머 설정은 워크스페이스 생성 시 입력했던 발표 제한 시간을 기준으로 제공됩니다. 이 기능은 발표자가 시간을 관리하며 연습할 수 있도록 도와줍니다. <👉 화면 가리키기> 이어서 대본 큐카드 QR 기능에 대해 말씀드리겠습니다.",
        },
        {
          section: 3,
          keyword: "대본 큐카드 QR",
          text: "대본 큐카드 QR 기능은 QR 코드를 통해 모바일에서 발표 대본을 간편하게 확인할 수 있는 서비스입니다. 이 기능은 발표자가 발표 내용을 쉽게 접근하고 활용할 수 있도록 지원합니다. <🔍 청중 바라보기> 이제 발표의 주요 기능들을 정리하겠습니다.",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "연습 모드",
          text: "AI 발표 피드백 서비스의 주요 기능인 연습 모드, 타이머 설정, 대본 큐카드 QR 기능 설명",
        },
      ],
      qrSlug: "a3d54f05daad",
      qrUrl: "https://pres.app/cuecard/a3d54f05daad",
    },
    {
      slideNumber: 18,
      basic: [
        {
          section: 1,
          keyword: "질의 응답",
          text: "이번 단계에서는 질의 응답에 대해 설명드리겠습니다. <🌬 호흡> 발표 자료를 기반으로 예상 질문과 모범 답안을 생성하는 과정이 포함됩니다. <👉 화면 가리키기> 이를 통해 사용자는 실제 발표 상황에 대비할 수 있는 기회를 갖게 됩니다.",
        },
        {
          section: 3,
          keyword: "모범 답안",
          text: "모범 답안을 생성하는 과정은 특히 유용합니다. <👉 화면 가리키기> 이는 발표자가 질문에 대한 적절한 답변을 사전에 연습할 수 있도록 도와줍니다. <✋ 제스처> 따라서, 발표자는 질문에 대한 대처 능력을 향상시킬 수 있습니다.",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "질의 응답",
          text: "발표 자료를 기반으로 예상 질문과 모범 답안을 생성하여 발표 준비를 강화하는 단계",
        },
      ],
      qrSlug: "25f62fb557bf",
      qrUrl: "https://pres.app/cuecard/25f62fb557bf",
    },
    {
      slideNumber: 19,
      basic: [
        {
          section: 1,
          keyword: "사용자 피드백",
          text: "사용자 피드백은 두 가지 모드에서 제공됩니다. 첫 번째는 연습 모드로, 사용자가 연습한 내용을 바탕으로 피드백을 제공합니다. 두 번째는 질의응답 모드로, 사용자가 질문한 내용에 대한 피드백을 제시합니다. <🔍 청중 바라보기> 이 두 가지 모드는 사용자가 보다 효과적으로 학습할 수 있도록 돕습니다.",
        },
        {
          section: 2,
          keyword: "평가 항목",
          text: "피드백은 총 네 가지 평가 항목으로 구성되어 있습니다. 각 항목은 사용자의 발표 능력을 종합적으로 평가하는 데 기여합니다. <👉 화면 가리키기> 또한, 종합 총평을 통해 사용자는 자신의 발표에 대한 전반적인 평가를 받을 수 있습니다.",
        },
        {
          section: 3,
          keyword: "연습 추세",
          text: "이 시스템은 이전 기록과 점수를 통해 사용자의 연습 추세를 확인할 수 있는 기능을 제공합니다. 이를 통해 사용자는 자신의 발전 상황을 명확히 파악할 수 있습니다. <🌬 호흡> 다음으로, 이러한 피드백 시스템이 어떻게 작동하는지에 대해 설명드리겠습니다.",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "사용자 피드백",
          text: "사용자 피드백 시스템의 기능과 평가 항목에 대한 설명",
        },
      ],
      qrSlug: "2871718c5e90",
      qrUrl: "https://pres.app/cuecard/2871718c5e90",
    },
    {
      slideNumber: 20,
      basic: [
        {
          section: 1,
          keyword: "사용자 피드백",
          text: "사용자 피드백 단계에서는 연습 모드와 질의응답에 대한 피드백을 제공합니다. <🌬 호흡> 총 네 가지 평가 항목과 종합 총평을 통해 사용자는 자신의 성과를 확인할 수 있습니다. <👉 화면 가리키기> 또한, 이전 기록과 점수를 통해 연습 추세를 분석할 수 있습니다.",
        },
        {
          section: 2,
          keyword: "페이지별 피드백",
          text: "페이지별 피드백은 각 페이지에 대한 상세한 평가를 제공합니다. <📄 발표자료 보기> 점수가 부족한 항목과 발생 횟수를 구체적으로 제시하여 사용자가 개선할 수 있는 방향을 제시합니다. <✋ 제스처> 이러한 피드백은 학습의 효과성을 높이는 데 기여합니다.",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "사용자 피드백",
          text: "사용자 피드백과 페이지별 피드백을 통한 학습 효과성 증대",
        },
      ],
      qrSlug: "e770f6a951a0",
      qrUrl: "https://pres.app/cuecard/e770f6a951a0",
    },
    {
      slideNumber: 21,
      basic: [
        {
          section: 1,
          keyword: "인사말",
          text: "이상으로 'AI 발표 피드백 서비스'에 대한 발표를 마치겠습니다. 감사합니다. <🔍 청중 바라보기>",
        },
      ],
      advanced: [
        {
          section: 1,
          keyword: "인사말",
          text: "마무리 인사",
        },
      ],
      qrSlug: "46c256495717",
      qrUrl: "https://pres.app/cuecard/46c256495717",
    },
  ],
  errors: {},
};

const MobileCueCard = () => {
  const params = useParams();
  const [projectInfo, setProjectInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeepMode, setIsDeepMode] = useState(false);
  const [showNonverbal, setShowNonverbal] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const totalPages = backendResponse.slides.length;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await getProjectInfo(params.id);
        setProjectInfo(project);
      } catch (err) {
        console.error("프로젝트 정보 불러오기 실패:", err);
      } finally {
        // Simulate loading time
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    };

    fetchProject();
  }, [params.id]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentSlide = backendResponse.slides[currentPage - 1];
  const currentCueCard = currentSlide?.basic[0] || { keyword: "", text: "" };
  const nextSlide =
    currentPage < totalPages ? backendResponse.slides[currentPage] : null;
  const nextCueCard = nextSlide?.basic[0];

  // basic 정렬
  const sortedBasic = [...(currentSlide.basic || [])].sort(
    (a, b) => (a.section ?? 0) - (b.section ?? 0)
  );

  const progress = (currentPage / totalPages) * 100;

  if (isLoading) {
    return (
      <div className="MobileCueCard__loading">
        <div className="MobileCueCard__header">
          <h1 className="MobileCueCard__title">
            {projectInfo?.projectTitle || "Hg_중간발표"}
          </h1>
          <button className="MobileCueCard__menu" disabled>
            <img src={iconDots} alt="menu" />
          </button>
        </div>

        <div className="MobileCueCard__loading-content">
          <div className="MobileCueCard__loading-icon">
            <img src={LoadingLogo} alt="Loading" />
          </div>

          <div className="MobileCueCard__loading-progress-container">
            <div className="MobileCueCard__loading-progress-bar">
              <div className="MobileCueCard__loading-progress-fill" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="MobileCueCard">
      {/* Header with title */}
      <div className="MobileCueCard__header">
        <h1 className="MobileCueCard__title">
          {projectInfo?.projectTitle || "Hg_중간발표"}
        </h1>
        <button
          className="MobileCueCard__menu"
          onClick={() => setIsMenuOpen(true)}
        >
          <img src={iconDots} alt="menu" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="MobileCueCard__progress-container">
        <div className="MobileCueCard__progress-bar">
          <div
            className="MobileCueCard__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="MobileCueCard__page-number">
          {currentPage} / {totalPages}
        </div>
      </div>

      {/* Cue Card */}
      <div className="MobileCueCard__content">
        {sortedBasic.map((item, idx) => (
          <CueCard
            key={`basic-${idx}`}
            keyword={item.keyword}
            value={item.text}
            showNonverbal={showNonverbal} // 토글 연동
            onChange={() => {}}
          />
        ))}
      </div>

      {/* Next page preview */}
      {nextCueCard && (
        <div className="MobileCueCard__next-preview">
          다음페이지 내용: {nextCueCard.keyword}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="MobileCueCard__navigation">
        <button
          className="MobileCueCard__nav-btn"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          ←
        </button>
        <button
          className="MobileCueCard__nav-btn"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          →
        </button>
      </div>

      {/* Bottom Sheet Modal */}
      {isMenuOpen && (
        <>
          <div
            className="MobileCueCard__modal-overlay"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="MobileCueCard__modal">
            <div className="MobileCueCard__modal-handle" />

            <div className="MobileCueCard__modal-option">
              <span>대본 심화버전</span>
              <label className="MobileCueCard__toggle">
                <input
                  type="checkbox"
                  checked={isDeepMode}
                  onChange={(e) => setIsDeepMode(e.target.checked)}
                />
                <span className="MobileCueCard__toggle-slider" />
              </label>
            </div>

            <div className="MobileCueCard__modal-option">
              <span>비언어적 표현 가이드</span>
              <label className="MobileCueCard__toggle">
                <input
                  type="checkbox"
                  checked={showNonverbal}
                  onChange={(e) => setShowNonverbal(e.target.checked)}
                />
                <span className="MobileCueCard__toggle-slider" />
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MobileCueCard;
