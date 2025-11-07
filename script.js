// 상태
const state = {
  user: { name: "", birth: "", gender: "", phone: "" },
  age: null,
  eiAnswer: null, // 'E' or 'I' (알림용)
  currentScreen: 0,
  // 10문항 진행
  qIndex: 0, // 0~9
  answers: new Array(10).fill(null), // 각 문항의 선택 (1 or 2)
  scores: { A: 0, B: 0, C: 0, D: 0 },
  resultType: null
};

// 화면 전환
const track = document.getElementById("track");
function goTo(screenIndex){
  state.currentScreen = screenIndex;
  track.style.transform = `translateX(-${screenIndex * 100}%)`;
}

// 초기 요소 바인딩
document.getElementById("startBtn").addEventListener("click", () => goTo(1));

const userForm = document.getElementById("userForm");
userForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(userForm);
  state.user.name = (formData.get("name") || "").trim();
  state.user.birth = formData.get("birth");
  state.user.gender = formData.get("gender") || "";
  state.user.phone = (formData.get("phone") || "").trim();

  if(!state.user.name || !state.user.birth || !state.user.gender || !state.user.phone){
    alert("모든 정보를 입력해 주세요.");
    return;
  }

  state.age = calcAge(state.user.birth);
  renderProfile();
  goTo(2);
});

// 나이 계산 (만 나이)
function calcAge(dateStr){
  const today = new Date();
  const birth = new Date(dateStr);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// 프로필 요약 렌더링
function renderProfile(){
  document.getElementById("profileName").textContent = `${state.user.name}`;
  document.getElementById("profileAge").textContent = `만 ${state.age}세`;
  document.getElementById("profileBirth").textContent = state.user.birth;
  document.getElementById("profileGender").textContent = state.user.gender;
  document.getElementById("profilePhone").textContent = state.user.phone;

  // EI 질문 렌더도 이름 반영
  const eiOptions = document.getElementById("eiOptions");
  eiOptions.innerHTML = `
    <label class="option">
      <input type="radio" name="ei" value="E" />
      <span>${state.user.name}님은 밖에 나가는 것을 좋아하시나요?</span>
    </label>
    <label class="option">
      <input type="radio" name="ei" value="I" />
      <span>${state.user.name}님은 집에서 휴식을 취하는 것을 좋아하시나요?</span>
    </label>
  `;
  eiOptions.querySelectorAll('input[name="ei"]').forEach((el)=>{
    el.addEventListener("change", (e)=>{
      state.eiAnswer = e.target.value;
      if(state.eiAnswer === "E"){
        alert(`${state.user.name}님은 외향형입니다!!`);
      }else{
        alert(`${state.user.name}님은 내향형입니다!!`);
      }
      goTo(4); // 다음: 10문항 화면
      renderQuestion();
      updateProgress();
    });
  });
}

document.getElementById("profileBack").addEventListener("click", ()=> goTo(1));
document.getElementById("toEI").addEventListener("click", ()=> goTo(3));

// 10문항 데이터
const questions = [
  { q:"주말에 시간이 생기면 나는 ?", o1:"혼자만의 시간을 보내며 힐링한다.", o2:"친구들과 어울리며 활발하게 논다." },
  { q:"새로운 일을 시작할 때 나는 ?", o1:"신중하게 계획을 세고 준비한다.", o2:"일단 시도해보며 경험으로 배운다." },
  { q:"나에게 취미란?", o1:"나를 돌아보는 조용한 시간", o2:"사람들과 소통하고 에너지 얻는 활동" },
  { q:"스트레스 받을 때 나는?", o1:"조용히 음악을 듣거나 글을 쓴다.", o2:"몸을 움직이거나 밖으로 나가 활동한다." },
  { q:"몰입했을 때 가장 행복한 순간은?", o1:"손으로 무언가를 만들 때", o2:"누군가와 함께 협력하며 성취할 때" },
  { q:"취미 활동을 선택할 때 나는?", o1:"꾸준히 할 수 있는게 중요하다.", o2:"짧은 시간이라도 흥미롭고 새로운 게 좋다." },
  { q:"주중 하루 중 자유시간은?", o1:"밤에 잠깐(30분~1시간)", o2:"주말 위주로 넉넉하게 있다." },
  { q:"나에게 이상적인 취미 모임은?", o1:"조용한 소규모 클래스", o2:"활기찬 그룹 활동" },
  { q:"새로운 사람을 만나는 것에 대해서?", o1:"부담스럽지만 천천히 친해지고 싶다.", o2:"다양한 사람들과 금방 어울릴 수 있다." },
  { q:"'취미 키트'를 고를 때 나는?", o1:"혼자서 몰입할 수 있는 키트", o2:"함께 즐길 수 있는 키트" }
];

// 점수 로직 (문항별 선택 → 타입 점수)
function applyScore(qIdx, choice){
  const add = (types)=> types.forEach(t => state.scores[t]++);
  switch(qIdx){
    case 0: if(choice==1) add(["A","B"]); else add(["C","D"]); break;
    case 1: if(choice==1) add(["A"]); else add(["D"]); break;
    case 2: if(choice==1) add(["A","B"]); else add(["C","D"]); break;
    case 3: if(choice==1) add(["A"]); else add(["C","D"]); break;
    case 4: if(choice==1) add(["B"]); else add(["C"]); break;
    case 5: if(choice==1) add(["A","B"]); else add(["D"]); break;
    case 6: if(choice==1) add(["A"]); else add(["C","D"]); break;
    case 7: if(choice==1) add(["A","B"]); else add(["C","D"]); break;
    case 8: if(choice==1) add(["A"]); else add(["C"]); break;
    case 9: if(choice==1) add(["A","B"]); else add(["C","D"]); break;
  }
}

// 이미 더한 점수 되돌리기(이전으로 갔을 때 재계산용)
function undoScore(qIdx, choice){
  if(choice == null) return;
  const sub = (types)=> types.forEach(t => state.scores[t]--);
  switch(qIdx){
    case 0: if(choice==1) sub(["A","B"]); else sub(["C","D"]); break;
    case 1: if(choice==1) sub(["A"]); else sub(["D"]); break;
    case 2: if(choice==1) sub(["A","B"]); else sub(["C","D"]); break;
    case 3: if(choice==1) sub(["A"]); else sub(["C","D"]); break;
    case 4: if(choice==1) sub(["B"]); else sub(["C"]); break;
    case 5: if(choice==1) sub(["A","B"]); else sub(["D"]); break;
    case 6: if(choice==1) sub(["A"]); else sub(["C","D"]); break;
    case 7: if(choice==1) sub(["A","B"]); else sub(["C","D"]); break;
    case 8: if(choice==1) sub(["A"]); else sub(["C"]); break;
    case 9: if(choice==1) sub(["A","B"]); else sub(["C","D"]); break;
  }
}

// 질문 렌더링
const qNumber = document.getElementById("qNumber");
const qText = document.getElementById("qText");
const opt1 = document.getElementById("opt1");
const opt2 = document.getElementById("opt2");
const qForm = document.getElementById("qForm");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

function renderQuestion(){
  const idx = state.qIndex;
  const data = questions[idx];
  qNumber.textContent = `Q${idx+1}`;
  qText.textContent = `${state.user.name}님은 ${data.q}`;
  opt1.textContent = data.o1;
  opt2.textContent = data.o2;

  // 기존 선택값 표시
  qForm.reset();
  if(state.answers[idx]){
    const sel = qForm.querySelector(`input[value="${state.answers[idx]}"]`);
    if(sel) sel.checked = true;
  }
}

function updateProgress(){
  const percent = Math.round((state.qIndex) / 10 * 100);
  const displayPercent = Math.round((state.qIndex) / 10 * 100);
  progressBar.style.width = `${displayPercent}%`;
  progressText.textContent = `${displayPercent}% (${state.qIndex}/10)`;
}

// 이전/다음
document.getElementById("prevQ").addEventListener("click", ()=>{
  if(state.qIndex === 0){
    goTo(3); // EI 화면으로
    return;
  }
  // 현재 선택 취소에 따른 점수 롤백
  const curChoice = state.answers[state.qIndex];
  if(curChoice != null){ undoScore(state.qIndex, curChoice); }

  state.qIndex--;
  renderQuestion();
  updateProgress();
});

document.getElementById("nextQ").addEventListener("click", ()=>{
  const formData = new FormData(qForm);
  const choice = formData.get("choice");

  if(!choice){
    alert("하나를 선택해 주세요.");
    return;
  }

  const c = Number(choice);
  // 기존 선택과 다르면 점수 갱신
  if(state.answers[state.qIndex] != null){
    // 이전 점수 제거 후 새로 반영
    undoScore(state.qIndex, state.answers[state.qIndex]);
  }
  state.answers[state.qIndex] = c;
  applyScore(state.qIndex, c);

  if(state.qIndex === 9){
    // 끝 → 결과
    finalizeResult();
    goTo(5);
  }else{
    state.qIndex++;
    renderQuestion();
    updateProgress();
  }
});

// 결과 계산 및 렌더
const resultTitle = document.getElementById("resultTitle");
const resultSummary = document.getElementById("resultSummary");
const recommendList = document.getElementById("recommendList");

const typeMeta = {
  A: { title:"내향 & 감성형", summary:"혼자 몰입하며 감정을 정리하는 타입",
       recommends:["향초& 디퓨저 만들기","자수","드로잉","글쓰기","독서 모임"] },
  B: { title:"창의 & 표현형", summary:"자신을 표현하고 창작으로 에너지를 얻는 타입",
       recommends:["캘리그래피","DIY키트","영상/사진 편집","디자인 클래스"] },
  C: { title:"외향 & 활동형", summary:"사람들과 어울리고 에너지를 얻는 타입",
       recommends:["쿠킹 클래스","보드게임","플라워 클래스","연극/댄스"] },
  D: { title:"탐험 & 경험형", summary:"새로운 경험과 자극을 추구하는 타입",
       recommends:["당일치기 여행","사진 워크숍","봉사 활동","새로운 취미 체험"] }
};

function finalizeResult(){
  // 최댓값 타입 결정 (동점이면 A>B>C>D 우선)
  const entries = Object.entries(state.scores); // [ ['A',n], ... ]
  entries.sort((a,b)=> b[1]-a[1] || "ABCD".indexOf(a[0]) - "ABCD".indexOf(b[0]));
  state.resultType = entries[0][0];

  const meta = typeMeta[state.resultType];
  resultTitle.textContent = `당신은 ${meta.title}이에요!!`;
  resultSummary.textContent = meta.summary;

  recommendList.innerHTML = "";
  meta.recommends.forEach(r=>{
    const li = document.createElement("li");
    li.textContent = r;
    recommendList.appendChild(li);
  });
}

// 키트 화면
document.getElementById("toKits").addEventListener("click", ()=>{
  renderKits();
  goTo(6);
});
document.getElementById("backToResult1").addEventListener("click", ()=> goTo(5));

function renderKits(){
  const meta = typeMeta[state.resultType];
  const kitIntro = document.getElementById("kitIntro");
  const kitList = document.getElementById("kitList");
  kitIntro.textContent = `${meta.title} 추천 키트를 살펴보세요. (임시 링크: 네이버)`;
  kitList.innerHTML = "";
  meta.recommends.forEach((label, i)=>{
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "https://www.naver.com/";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = `키트: ${label}`;
    li.appendChild(a);
    kitList.appendChild(li);
  });
}

// 친구 찾기 화면
document.getElementById("toFriends").addEventListener("click", ()=>{
  renderFriend();
  goTo(7);
});
document.getElementById("backToResult2").addEventListener("click", ()=> goTo(5));

function renderFriend(){
  const friendMap = {
    A: { name:"이예빈", age:24, area:"서울", note:"성수에서 향수 공방에 가보고 싶어요~" },
    B: { name:"김채현", age:23, area:"서울", note:"함께 간단하게 영상을 찍고 편집해 보고 싶어요~" },
    C: { name:"노영채", age:21, area:"서울", note:"원데이 플라워 클래스에 가보고 싶어요~" },
    D: { name:"박주연", age:22, area:"경기도", note:"강원도로 당일치기 여행 가고 싶어요~" }
  };
  const f = friendMap[state.resultType];
  const box = document.getElementById("friendCard");
  box.innerHTML = `
    <div class="friend-name">${f.name} · ${f.age}살</div>
    <div>지역: ${f.area}</div>
    <div class="friend-note">${f.note}</div>
  `;
}

// 초기화
(function init(){
  // EI 타이틀에 이름 반영은 프로필에서 렌더
  // 진행률 초기
  updateProgress();
})();