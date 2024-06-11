const addRoundButton = document.getElementById("add-a-round");
const scoreContainer = document.querySelector(".score-container");
const courseDropDownList = document.querySelector(".score-container-drpdwn");
const scoreSummaryContainer = document.querySelector(".rounds__col");
const scorecardTable = document.querySelector(".score-container-table");
const submitRoundButton = document.querySelector(".submit-round-btn");
const userScore = document.querySelector(".score-container-score");
const roundDate = document.querySelector(".score-container-date");
const roundsFilterDropDown = document.querySelector(".rounds__dropdown");

let cardTableExists = false;
let parInputs;
let parField;
let totalStrokes = 0;
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
  scoreToPar: 0,
  total: 0,
  dateOfRound: "",
};

const createScoreCard = () => {
  addRoundButton.style.display = "none";
  createDropDownOptionTags();
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
        .appendChild(document.createElement("div"));
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
    hole.innerText = course.scoreCard[index + 1];
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
    if (userInputs[index].value) {
      overAllScore +=
        parseInt(userInputs[index].value) - parseInt(input.innerText);
    }
  });
  document.querySelector(".score-container-currentscore").innerText =
    overAllScore > 0
      ? `+${overAllScore}`
      : overAllScore === 0
      ? "Even"
      : overAllScore;
  currentRound.scoreToPar = overAllScore;
  currentRound.total = totalStrokes;
};

const isCardComplete = () => {
  let cardComplete = true;
  let parInputs = document.querySelectorAll(".par-score");
  let userInputs = document.querySelectorAll(".user-score");
  parInputs.forEach((input, index) => {
    if (!userInputs[index].value) {
      cardComplete = false;
    }
  });
  if (cardComplete) {
    submitRoundButton.style.display = "block";
  }
};

const sumTotal = (parElements) => {
  let total = 0;
  parElements.forEach((el) => {
    total += el.value ? parseInt(el.value) : 0;
  });
  totalStrokes = total;
  return totalStrokes;
};

const getRounds = () => {
  let rounds = JSON.parse(localStorage.getItem("rounds"));
  rounds.forEach((round) => myRounds.push(round));
  displayScores();
};

const displayScores = () => {
  scoreSummaryContainer.innerHTML = "";
  myRounds.forEach((round) => {
    createRound(round);
  });
};

const createRound = (round) => {
  let roundCard = document.createElement("div");
  roundCard.className = "round-cards";
  scoreSummaryContainer.appendChild(roundCard);
  console.log(round);
  let cardContents = `
    <div>Course:${round.course}</div>
    <div>Round Date:${round.dateOfRound}</div>
    <div>Score to Par:${round.scoreToPar}</div>
    <div>Total:${round.total}</div>
    `;
  roundCard.innerHTML = cardContents;
};

const filterRounds = (filter) => {
  switch (filter) {
    case "lowToHigh":
      myRounds.sort((a, b) => a.total - b.total);
      displayScores();
      break;
    case "highToLow":
      myRounds.sort((a, b) => b.total - a.total);
      displayScores();
      break;
    case "newest":
      myRounds.sort(
        (a, b) => Date.parse(b.dateOfRound) - Date.parse(a.dateOfRound)
      );
      displayScores();
      break;
    case "older":
      myRounds.sort(
        (a, b) => Date.parse(a.dateOfRound) - Date.parse(b.dateOfRound)
      );
      displayScores();
      break;
  }
};

addRoundButton.addEventListener("click", createScoreCard);
courseDropDownList.addEventListener("change", (e) => {
  let courseId = e.target.options[e.target.selectedIndex].id;
  console.log(courseId);
  createCardTable(courseId);
  currentRound.course = courses
    .filter((course) => course.id == courseId)
    .pop().name;
  scorecardTable.style.display = "block";
  userScore.style.display = "block";
  roundDate.style.display = "block";
});
submitRoundButton.addEventListener("click", () => {
  myRounds.push(currentRound);
  localStorage.setItem("rounds", JSON.stringify(myRounds));
  displayScores(currentRound);
});
roundDate.addEventListener("change", () => {
  currentRound.dateOfRound = roundDate.value;
});

roundsFilterDropDown.addEventListener("change", (e) => {
  filterRounds(e.target.value);
});
