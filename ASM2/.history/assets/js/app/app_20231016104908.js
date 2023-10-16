let app = angular.module("learningHub", ["ngRoute"]);
let BASE_URL = "http://localhost:3000/";
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "templates/home.html",
            controller: ProductController
        })
        .when("/contact", {
            templateUrl: "templates/contact.html",
        })
        .when("/about", {
            templateUrl: "templates/about.html",
        })
        .when("/blog", {
            templateUrl: "templates/blog.html",
        })
        .when("/question", {
            templateUrl: "templates/question.html",
            controller: QuestionController
        })
        .when("/detailCourse/:id", {
            templateUrl: "templates/detailCourse.html",
            controller: detailController
        })
        .otherwise({
            redirectTo: "templates/home.html"
        });
});

app
    .controller('LoginControllerHTML', LoginController)
    .controller('RegisterControllerHTML',RegisterController)
    .controller('ProductControllerHTML', ProductController)
    .controller('QuestionControllerHTML', QuestionController);

app.filter('truncateWordsHTML', function () {
    return function (input, limit) {
        if (!input) return '';

        let words = input.split(' ');
        if (words.length <= limit) {
            return input;
        }
        return words.slice(0, limit).join(' ') + '...';
    };
})

// Start: Đăng nhập    
function LoginController($scope, $rootScope, $http) {
    $rootScope.isLogin = false;
    $scope.listProfiles = [];
    $http({
        method: 'GET',
        url: BASE_URL + 'profiles'
    }).then(function successCallback(response) {
        $scope.listProfiles = response.data;
        $rootScope.login = function () {
            $scope.listProfiles.forEach(element => {
                if (element.username == $scope.user.loginName && element.password == $scope.user.loginPass) {
                    $rootScope.isLogin = true;
                    $rootScope.userNameSuccess = element.username;
                    $rootScope.userMarkSuccess = element.marks;
                }
            });

            if ($rootScope.isLogin == true) {
                // alert("THÀNH CÔNG");
                $('#loginModal').modal('hide');
            } else {
                alert("SAI TÀI KHOẢN");
            }
        }
    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });

}
//Not complete yet
//End: Đăng nhập

function RegisterController($scope,$http){
    $scope.isRegisterSuccess = false;
    $scope.register=function(){
        $http({
            method: 'POST',
            url: BASE_URL + 'profiles',
            data: $scope.user
          }).then(function successCallback(response) {
              // this callback will be called asynchronously
              // when the response is available
            }, function errorCallback(response) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });
    }
}

// Start: danh sách khóa học

function ProductController($scope, $http, $rootScope) {
    $scope.listProducts = [];
    $scope.pageCount=0;
    $http({
        method: 'GET',
        url: BASE_URL + 'products'
    }).then(function successCallback(response) {
        $scope.listProducts = response.data;
        $scope.pageCount=Math.ceil($scope.listProducts.length/8);
        $scope.begin=0;
        $rootScope.first=function() {
            $scope.begin=0;
        }
        $rootScope.prev=function() {
            if( $scope.begin>0){
                $scope.begin-=8;
            }
        }
        $rootScope.next=function() {
            if( $scope.begin<($scope.pageCount-1)*8){
                $scope.begin+=8;
            }
        }
        $rootScope.last=function() {
            $scope.begin=($scope.pageCount-1)*8
        }
    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });
}
//End: Danh sách khóa học

//Bảng câu hỏi
function QuestionController($scope, $timeout) {
    // Declare variables
    const timerDisplay = document.getElementById('timer');
    const questionContainer = document.getElementById("question-container");
    const nextButton = document.getElementById("next-button");
    const scoreButton = document.getElementById("score-button");
    const statusQuestion = document.getElementById("status-question");

    let currentQuestionIndex = 0;
    let score = 0;
    $scope.countdown = 30; // fixed for performance
    let timeLeft = $scope.countdown;

    const questions = [
        {
            question: "Bạn Tên là gì?",
            options: ["Nguyễn Thành Trung", "Lê Văn Minh", "Trịnh Thị Nhì", "Nguyễn Thị Hồng"],
            correctAnswer: "Nguyễn Thành Trung"
        },
        {
            question: "Bạn đang học trường gì?",
            options: ["FPT Polytechnic Cần Thơ", "Đại học Cần Thơ", "Đại học Tây Đô", "Đại học Nam Cần Thơ"],
            correctAnswer: "FPT Polytechnic Cần Thơ"
        },
        {
            question: "Mã số sinh viên của Bạn là?",
            options: ["PC05677", "PC05467", "PC09125", "PC05132"],
            correctAnswer: "PC05132"
        },
        {
            question: "Bạn sinh năm bao nhiêu?",
            options: ["2006", "2002", "1999", "2004"],
            correctAnswer: "1999"
        },
        {
            question: "Quê hương của bạn ở đâu?",
            options: ["Vĩnh Long", "An Giang", "Bạc Liêu", "Cần Thơ"],
            correctAnswer: "An Giang"
        },
        {
            question: "Bạn đang học ngành gì?",
            options: ["Thiết kế đồ họa", "Phát triển phần mềm", "Marketing and SEO", "Kinh tế học"],
            correctAnswer: "Phát triển phần mềm"
        },
        // Add more questions in the same format
    ];

    //Start: Time to Quiz
    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.innerHTML = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (timeLeft === 0) {
            clearInterval(interval);
            timerDisplay.innerHTML = "Hết giờ!";
            // Update: Hiển thị kết quả làm bài khi hết giờ
            updateResults();
        } else {
            timeLeft--;
        }
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    //End: Time to Quiz

    function displayQuestion(index) {
        const question = questions[index];
        const optionsHtml = question.options.map((option, i) => `
            <div class="custom-control custom-radio">
                <input type="radio" class="custom-control-input" id="q${index + 1}a${i + 1}" name="q${index + 1}" value="${option}">
                <label class="custom-control-label" for="q${index + 1}a${i + 1}">${option}</label>
            </div>
        `).join("");

        const questionHtml = `
            <h5>${index + 1}. ${question.question}</h5>
            ${optionsHtml}
        `;
        questionContainer.innerHTML = questionHtml;
        statusQuestion.innerHTML = `<h6>Câu ${currentQuestionIndex + 1} trong ${questions.length}</h6>`;
        scoreButton.textContent = `Score: ${score}/${questions.length}`;
    }

    function checkAnswer(index) {
        const selectedOption = document.querySelector(`input[name="q${index + 1}"]:checked`);
        if (!selectedOption.checked) { return }
        else if (!selectedOption) { return false }
        else { return selectedOption.value === questions[index].correctAnswer };
    }

    function checkQuestionFinish(currentQuestionIndex) {
        if (currentQuestionIndex < questions.length) {
            displayQuestion(currentQuestionIndex);
        } else {
            updateResults();
        }
    }

    nextButton.addEventListener("click", function (event) {
        event.preventDefault();

        if (checkAnswer(currentQuestionIndex)) {
            currentQuestionIndex++;
            score++;
            checkQuestionFinish(currentQuestionIndex);
        } else {
            currentQuestionIndex++;
            score = score;
            checkQuestionFinish(currentQuestionIndex);
        }
    });

    function updateResults() {
        questionContainer.innerHTML = `<h5>Kết thúc. Bạn đạt được ${score}/${questions.length} câu đúng</h5>`;
        nextButton.disabled = true;
        statusQuestion.innerHTML = `<h6>Câu ${currentQuestionIndex} trong ${questions.length}</h6>`;
        scoreButton.textContent = `Score: ${score}/${questions.length}`;
    }
    displayQuestion(currentQuestionIndex);

}
//End: Question

//detailCourse
function detailController($scope, $routeParams) {
    //console.log($routeParams.id)
    products.forEach(element => {
        if (element.id == $routeParams.id) {
            $scope.title = element.title;
            $scope.image = element.image;
            $scope.textDescription = element.textDescription;
        }
    });
}


