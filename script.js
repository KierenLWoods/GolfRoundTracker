const addRoundButton = document.getElementById("add-a-round");
const scoreContainer = document.querySelector(".score-container");
const courseDropDownList = document.querySelector(".score-container-drpdwn");
const scoreSummaryContainer = document.querySelector(".summary-container");

let cardTableExists = false;
let parInputs;
let parField;
const myRounds = [];
let userScoreToPar;

const courses = [
  {
    name: "Whitwood",
    id: 1,
    holes: 9,
    scoreCard: {
      1: 4,
      2: 4,
      3: 3,
      4: 5,
      5: 4,
      6: 3,
      7: 4,
      8: 4,
      9: 4,
    },
  },
  {
    name: "Drax",
    id: 2,
    holes: 9,
    scoreCard: {
      1: 4,
      2: 4,
      3: 4,
      4: 4,
      5: 3,
      6: 4,
      7: 4,
      8: 3,
      9: 4,
    },
  },
];

let currentRound = {
  course: "",
  scores: {},
};

const createScoreCard = () => {
  addRoundButton.style.display = "none";
  let cardContainer;
  cardContainer = document.querySelector(".card-container");
  if (cardContainer) {
    scoreContainer.removeChild(cardContainer);
  }
  cardContainer = document.createElement("div");
  cardContainer.className = "card-container";
  scoreContainer.appendChild(cardContainer);
  let userScoreContainer = document.createElement("div");
  userScoreContainer.className = "user-score-container";
  userScoreToPar = document.createElement("div");
  userScoreToPar.className = "user-score-to-par";
  userScoreToPar.innerText = 0;
  cardContainer.appendChild(userScoreContainer);
  userScoreContainer.appendChild(document.createElement("div")).innerText =
    "User Score:";
  userScoreContainer.appendChild(userScoreToPar);
  createDropDownOptionTags();
  createRoundSubmitButton();
};

const createCardTable = (courseId) => {
  //check if table already exists if so dont create a new one just update content
  //Create Table headers etc,
  //Fill in card
  //Add event listeners
  let selectedCourse = courses.filter((item) => item.id == courseId).pop();

  let tableBody = document.querySelector("tbody");
  //create body rows
  let trElementArray = new Array(selectedCourse.holes)
    .fill(0)
    .map((element, index) => {
      currentRound.scores[index + 1] = "";
      let trElement = document.createElement("tr");
      let rowheader = trElement.appendChild(document.createElement("th"));
      rowheader.innerText = `${index + 1}`;
      let par = trElement
        .appendChild(document.createElement("td"))
        .appendChild(document.createElement("input"));
      par.type = "number";
      par.className = "par-score";
      let userScore = trElement
        .appendChild(document.createElement("td"))
        .appendChild(document.createElement("input"));
      userScore.type = "number";
      userScore.className = "user-score";
      userScore.required = true;
      return trElement;
    });
  trElementArray.forEach((trelement) => {
    tableBody.appendChild(trelement);
  });
  parInputs = document.querySelectorAll(".par-score");
  userInputs = document.querySelectorAll(".user-score");
  let tableFoot = document.querySelector("tfoot");
  tableFoot.appendChild(document.createElement("th")).innerText = "Scores";
  parField = tableFoot.appendChild(document.createElement("td"));
  parField.className = "course-par";
  grossScoreField = tableFoot.appendChild(document.createElement("td"));
  grossScoreField.className = "gross-score";
  parScoreEntryEventListeners(parInputs);
  grossScoreEntryEventListeners(userInputs);
  fillInScoreCard(selectedCourse);
};

function createDropDownOptionTags() {
  courseDropDownList.style.display = "block";
  let defaultOption = document.createElement("option");
  defaultOption.innerText = "--Please Select a course--";
  courseDropDownList.appendChild(defaultOption);
  courses.forEach((el, index) => {
    let option = document.createElement("option");
    option.innerText = courses[index].name;
    option.id = courses[index].id;
    courseDropDownList.appendChild(option);
  });
}

function fillInScoreCard(course) {
  console.log(course);
  let parInputs = document.querySelectorAll(".par-score");
  parInputs.forEach((hole, index) => {
    hole.value = course.scoreCard[index + 1];
  });
}

const parScoreEntryEventListeners = (parInputArray) => {
  parInputArray.forEach((element) => {
    element.addEventListener("change", () => {
      document.querySelector(".course-par").innerText = sumTotal(parInputArray);
      calculateOverallScore();
      isCardComplete();
    });
  });
};

const grossScoreEntryEventListeners = (grossScoreInputArray) => {
  grossScoreInputArray.forEach((element, index) => {
    element.addEventListener("change", () => {
      document.querySelector(".gross-score").innerText =
        sumTotal(grossScoreInputArray);
      calculateOverallScore();
      isCardComplete();
    });
  });
};

const calculateOverallScore = () => {
  //get list of pars and user inputs
  let parInputs = document.querySelectorAll(".par-score");
  let userInputs = document.querySelectorAll(".user-score");
  let overAllScore = 0;
  parInputs.forEach((input, index) => {
    if (input.value && userInputs[index].value) {
      overAllScore += parseInt(userInputs[index].value) - parseInt(input.value);
    }
  });
  document.querySelector(".user-score-to-par").innerText =
    overAllScore > 0
      ? `+${overAllScore}`
      : overAllScore === 0
      ? "Even"
      : overAllScore;
};

const isCardComplete = () => {
  let cardComplete = true;
  let parInputs = document.querySelectorAll(".par-score");
  let userInputs = document.querySelectorAll(".user-score");
  parInputs.forEach((input, index) => {
    if (!input.value || !userInputs[index].value) {
      cardComplete = false;
    }
  });
  if (cardComplete) {
    console.log("Show me");
    document.querySelector(".submit-round-btn").style.display = "block";
  }
};

const sumTotal = (parElements) => {
  let total = 0;
  parElements.forEach((el) => {
    total += el.value ? parseInt(el.value) : 0;
  });
  return total;
};

const createCalculateScoreButton = () => {
  let calculateScoreButton = document.createElement("button");
  calculateScoreButton.className = "calculate-round-btn";
  calculateScoreButton.innerText = "Calculate Score";
  calculateScoreButton.style.display = "none";
  scoreContainer.appendChild(calculateScoreButton);
  calculateScoreButton.addEventListener("click", calculateScore);
};

const createRoundSubmitButton = () => {
  submitScoreButton = document.createElement("button");
  submitScoreButton.className = "submit-round-btn";
  submitScoreButton.innerText = "Submit Round";
  submitScoreButton.style.display = "none";
  scoreContainer.appendChild(submitScoreButton);
  submitScoreButton.addEventListener("click", () => {
    myRounds.push({
      score: userScoreToPar,
    });
    console.log(currentRound);
    displayScores();
  });
};

const calculateScore = () => {};

const displayScores = () => {
  myRounds.forEach((round) => {
    let roundCard = document.createElement("div");
    roundCard.className = "round-card";
    scoreSummaryContainer.appendChild(roundCard);
  });
};

addRoundButton.addEventListener("click", createScoreCard);
courseDropDownList.addEventListener("change", (e) => {
  let courseId = e.target.options[e.target.selectedIndex].id;
  console.log(courseId);
  createCardTable(courseId);
  currentRound.course = courses
    .filter((course) => course.id == courseId)
    .pop().name;
});
