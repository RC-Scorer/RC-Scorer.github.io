// =============================================================================
//  RCScoring  -  recording table
//  이 파일만 고치면 페이지 전체가 따라 바뀝니다. HTML 은 건드릴 필요 없습니다.
// =============================================================================
//
//  SCENARIOS 의 image 필드: 해당 시나리오 다이어그램 경로. 비워두면 그림 없이
//  글자만 나옵니다. (S5 회전, A3 원형교차로는 fig_1.pdf 에 없어서 비어 있습니다)
//
//  scenario  SCENARIOS 의 코드 ("S1".."S5", "A1".."A3").  "" 이면 Unassigned.
//  run       "baseline"  = 승차감 지표 없이 주행 (w_comfort = 0)
//            "comfort"   = 승차감 인지 모델 적용 주행
//            ""          = 미분류
//  speed     목표 속도 [km/h].  숫자 또는 "".
//  side      "left" | "right" | ""     (좌/우 반복 구분)
//  note      카드에 한 줄로 붙는 메모.  실패 사유 등.  "" 이면 안 나옴.
//  hidden    true 로 두면 페이지에서 제외됩니다.
//
//  예)  { id: "MAN_20260911_112010", ..., scenario: "S1", run: "baseline",
//          speed: 30, side: "left", note: "", hidden: false },

const SCENARIOS = [
  { code: "S1", group: "",
    title: "Three bumps under the left wheel track",
    detail: "Bumps under one track only, so a lateral offset of about a metre clears both wheels.",
    speeds: "15 / 30", image: "figures/scenario1.png" },
  { code: "S2", group: "",
    title: "Two bumps left, one right",
    detail: "The bumps alternate between the tracks, so the clear path weaves rather than offsetting once.",
    speeds: "15 / 30", image: "figures/scenario2.png" },
  { code: "S3", group: "",
    title: "One bump left, two right",
    detail: "The mirrored layout, which the vehicle enters from the other side.",
    speeds: "15 / 30", image: "figures/scenario3.png" },
  { code: "S4", group: "",
    title: "Unequal height at the same station",
    detail: "Two bumps of different height at the same longitudinal station. No candidate avoids both, and the correct behaviour is to move toward the lower one.",
    speeds: "15 / 30", image: "figures/scenario4.png" },
  { code: "S5", group: "",
    title: "Pothole field",
    detail: "A run of potholes in the lane, driven at the lower speed setting only.",
    speeds: "15", image: "figures/scenario6.png" },
  { code: "S6", group: "",
    title: "Obstacles between the wheel tracks",
    detail: "The obstacles sit between the tracks. Any lateral motion would put a wheel on one, so holding the lane centre is the correct answer.",
    speeds: "15 / 30", image: "figures/scenario5.png" },
];

const RECORDINGS = [
  // 아직 비어 있습니다. RCScoring 실차 영상을 web/videos/ 와 web/posters/ 에
  // 넣고, 파일마다 아래 형식으로 한 줄씩 추가하세요.
  //
  // { id: "<videos/<id>.mp4 의 id>", clock: "11:20:10", seconds: 60,
  //   scenario: "S1", run: "baseline", speed: 30, side: "left",
  //   note: "", hidden: false },
];
