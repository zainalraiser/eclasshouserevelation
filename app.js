(() => {
  const STUDENTS=[
    {name:"Faridil Thoriq Orthega",house:"Sirius"},
    {name:"Ayuna Raisa Zayyani",house:"Sirius"},
    {name:"Shakila Ruby Hikmah Saniaya",house:"Sirius"},
    {name:"Muhammad Zikrillah Munawwar",house:"Sirius"},
    {name:"Naqeeb Aushaf Syazani",house:"Sirius"},
    {name:"Bagas Hardana",house:"Sirius"},
    {name:"Ahsan Faeyza Rachman",house:"Sirius"},
    {name:"Mahira Althaf",house:"Sirius"},
    {name:"Rafi Dzulkamal Ahmad",house:"Sirius"},
    {name:"Shakira Lilyana mahani pratiwi",house:"Sirius"},
    {name:"Fauzan Ibra Al Kafi",house:"Sirius"},
    {name:"Mikhayla Azzahra",house:"Sirius"},
    {name:"Yusuf Jabbar Al- Bukhari",house:"Aldebaran"},
    {name:"Naufal Alfahroni Jayadi",house:"Aldebaran"},
    {name:"Atika Ratifah Maulana",house:"Aldebaran"},
    {name:"Deya Faeyza Khansa",house:"Aldebaran"},
    {name:"Aliyeya Shahnaz",house:"Aldebaran"},
    {name:"Afita Rafanda Syafruddin",house:"Aldebaran"},
    {name:"Nindya Putriyana",house:"Aldebaran"},
    {name:"Marsya Hayfa Asbelly",house:"Aldebaran"},
    {name:"Nada Nabila Qanita",house:"Aldebaran"},
    {name:"Muhammad Nabil Fatih Ramadhon",house:"Aldebaran"},
    {name:"Nailah Salsabila",house:"Aldebaran"},
    {name:"Abdurrahman Wahrasyidil",house:"Aldebaran"}
  ];
  const $=id=>document.getElementById(id);
  const screens=[...document.querySelectorAll(".screen")];
  let currentStudent=null,currentHouse=null,currentSelection=null;
  const normalize=v=>v.trim().toLowerCase().replace(/\s+/g," ");
  const show=id=>screens.forEach(s=>s.classList.toggle("active",s.id===id));
  const theme=h=>{document.body.classList.remove("theme-aldebaran","theme-sirius");if(h)document.body.classList.add(h==="Aldebaran"?"theme-aldebaran":"theme-sirius")};

  const selector=$("nameSelector"),trigger=$("selectTrigger"),selected=$("selectedName"),findBtn=$("findStarBtn");

  const menu=$("nameMenu");

  // Shuffle the student list every time the Star Altar is opened.
  // The House assignment remains attached to each student, but the
  // visible order no longer reveals the House grouping from the source list.
  const shuffledStudents=[...STUDENTS];
  for(let i=shuffledStudents.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [shuffledStudents[i],shuffledStudents[j]]=[shuffledStudents[j],shuffledStudents[i]];
  }

  menu.innerHTML=shuffledStudents.map(s=>`<button class="name-option" type="button" data-name="${s.name.replace(/"/g,"&quot;")}"><span class="option-star">✦</span><span>${s.name}</span></button>`).join("")+
    `<button class="name-option mentor-option" type="button" data-name="Mentor" data-role="mentor"><span class="option-star">✦</span><span>Mentor</span></button>`;

  $("beginBtn").onclick=()=>{EClasAudio.play("altar");show("entry");setTimeout(()=>trigger.focus(),500)};
  $("backBtn").onclick=()=>{resetSelection();EClasAudio.stop();show("landing")};
  $("mentorBackBtn").onclick=()=>{resetSelection();EClasAudio.play("altar");show("entry")};

  trigger.onclick=()=>{
    selector.classList.toggle("open");
    trigger.setAttribute("aria-expanded",selector.classList.contains("open"));
  };

  document.querySelectorAll(".name-option").forEach(option=>{
    option.onclick=()=>{
      if(window.EClasAudio) EClasAudio.play("altar");
      const name=option.dataset.name;
      currentSelection=option.dataset.role==="mentor"?"mentor":"student";
      selected.textContent=name;
      selected.dataset.value=name;
      selected.dataset.role=currentSelection;
      findBtn.disabled=false;
      selector.classList.remove("open");
      trigger.setAttribute("aria-expanded","false");
      // Make the special Mentor option visually distinct without exposing any extra button.
      trigger.classList.toggle("mentor-selected",currentSelection==="mentor");
    };
  });

  document.addEventListener("click",e=>{
    if(!selector.contains(e.target)){selector.classList.remove("open");trigger.setAttribute("aria-expanded","false")}
  });

  findBtn.onclick=()=>{
    EClasAudio.play("awakening", true);
    if(currentSelection==="mentor"){
      currentStudent=null;currentHouse=null;
      show("searching");
      const messages=[
        ["The altar is listening...","The guiding stars are beginning to answer."],
        ["Two constellations detected.","Tracing the mentors of E-Clas."],
        ["The guides are awakening...","Preparing the Mentor revelation."]
      ];
      messages.forEach((m,i)=>setTimeout(()=>{$("searchTitle").textContent=m[0];$("searchSubtitle").textContent=m[1]},i*850));
      setTimeout(()=>{ EClasAudio.play("mentor", true); show("mentorReveal"); },2850);
      return;
    }

    const raw=selected.dataset.value;
    const match=STUDENTS.find(s=>normalize(s.name)===normalize(raw||""));
    if(!match)return;
    currentStudent=match;
    $("studentDisplay").textContent=match.name;
    $("errorMessage").textContent="";
    show("searching");
    const messages=[
      ["The altar is listening...","The stars are beginning to answer."],
      ["Your presence is known.","Tracing your constellation."],
      ["A star is awakening...","Preparing the House revelation."]
    ];
    messages.forEach((m,i)=>setTimeout(()=>{$("searchTitle").textContent=m[0];$("searchSubtitle").textContent=m[1]},i*850));
    setTimeout(()=>show("prereveal"),2850);
  };

  $("revealBtn").onclick=()=>{
    currentHouse=currentStudent.house;
    EClasAudio.play(currentHouse, true);const d=HOUSE_DATA[currentHouse];theme(currentHouse);
    $("houseName").textContent=d.name;$("houseTitle").textContent=d.title;$("houseMotto").textContent=d.motto;
    $("revealSymbol").src=d.symbol;
    $("revealSymbol").alt=`${d.name} symbol`;
    $("resultStudent").textContent=currentStudent.name;$("continueText").textContent=`Enter ${d.name}`;
    const stage=$( "revelation");stage.classList.remove("revealing");show("revelation");
    requestAnimationFrame(()=>requestAnimationFrame(()=>stage.classList.add("revealing")));
  };

  $("continueBtn").onclick=()=>{
    const d=HOUSE_DATA[currentHouse];
    $("pageHouseName").textContent=d.name;$("pageHouseTitle").textContent=d.title;$("pageHouseMotto").textContent=d.motto;
    $("pageHouseSymbol").src=d.symbol;
    $("pageHouseSymbol").alt=`${d.name} symbol`;
    $("pageStudent").textContent=currentStudent.name;
    $("housePageContent").className=`house-page theme-${currentHouse.toLowerCase()}`;
    $("housePageContent").querySelector(".values").innerHTML=d.values.map((v,i)=>`<div class="value"><span>0${i+1}</span>${v}</div>`).join("");
    show("housePage");
  };

  function resetSelection(){
    currentStudent=null;currentHouse=null;currentSelection=null;
    selected.textContent="Select your name";delete selected.dataset.value;delete selected.dataset.role;
    findBtn.disabled=true;$('errorMessage').textContent="";$('revelation').classList.remove('revealing');
    trigger.classList.remove("mentor-selected");
    document.body.classList.remove("theme-aldebaran","theme-sirius");
  }
  $("restartBtn").onclick=()=>{resetSelection();EClasAudio.stop();show("landing")};
})();
