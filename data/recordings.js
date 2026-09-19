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
    title: "Speed bumps under one wheel track",
    detail: "Bumps under a single track, so a lateral offset clears both wheels. In-zone aᵥ falls 82 %.",
    speeds: "15", image: "figures/scenario1.png" },
  { code: "S2", group: "",
    title: "Two bumps left, one right",
    detail: "The bumps alternate between the tracks, so the clear path weaves rather than offsetting once. aᵥ falls 84 %.",
    speeds: "15", image: "figures/scenario2.png" },
  { code: "S3", group: "",
    title: "One bump left, two right",
    detail: "The mirrored layout, entered from the other side. aᵥ falls 75 %.",
    speeds: "15", image: "figures/scenario3.png" },
  { code: "S4", group: "",
    title: "Unequal heights at the same station",
    detail: "Two bumps of different height at the same longitudinal station. No candidate avoids both, and the appropriate response is to move toward the lower one. aᵥ falls 61 %.",
    speeds: "15", image: "figures/scenario4.png" },
  { code: "S5", group: "",
    title: "Three low bumps between the wheel tracks",
    detail: "The obstacles sit between the tracks, so holding the lane centre leaves the wheels clear. The enabled scorer selected the centre in all 75 recorded cycles.",
    speeds: "15", image: "figures/scenario5.png" },
  { code: "S6", group: "",
    title: "Three potholes along one wheel track",
    detail: "Lateral avoidance is appropriate. The enabled run shifts left by 0.47 m on average in the obstacle zone, reducing aᵥ by 78 %.",
    speeds: "15", image: "figures/scenario6.png" },
];

const RECORDINGS = [
  // 3분할 합성본. 좌상 전방 카메라 / 좌하 실내 / 우측 RViz, 세 소스를 같은 시점에
  // 맞춰 자른 것입니다. 실내 얼굴과 본넷 마크는 마스킹되어 있습니다.
  { id: "scenario1", clock: "11:03", seconds: 30, scenario: "S1", run: "comfort",
    speed: 15, side: "", note: "", hidden: false },
  { id: "scenario2", clock: "12:28", seconds: 30, scenario: "S2", run: "comfort",
    speed: 15, side: "", note: "", hidden: false },
  { id: "scenario3", clock: "13:58", seconds: 29, scenario: "S3", run: "comfort",
    speed: 15, side: "", note: "", hidden: false },
  { id: "scenario4", clock: "14:08", seconds: 29, scenario: "S4", run: "comfort",
    speed: 15, side: "", note: "", hidden: false },
  { id: "scenario5", clock: "14:15", seconds: 29, scenario: "S5", run: "comfort",
    speed: 15, side: "", note: "", hidden: false },
  { id: "scenario6", clock: "14:24", seconds: 15, scenario: "S6", run: "comfort",
    speed: 15, side: "", note: "", hidden: false },
];
