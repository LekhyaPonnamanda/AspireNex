let quizzes = [];
        let currentQuizIndex = null;
        let timerInterval;
        let highestScore = 0;

        // Function to start the timer
        function startTimer(timeLimit) {
            let timeLeft = timeLimit;
            document.getElementById('time-left').textContent = formatTime(timeLeft);

            timerInterval = setInterval(() => {
                timeLeft--;
                document.getElementById('time-left').textContent = formatTime(timeLeft);

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    showModal('Time Over! The quiz will be submitted automatically.');
                }
            }, 1000);
        }

        // Function to format time
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        }

        // Function to add a question
        function addQuestion() {
            const questionsContainer = document.getElementById('questions-container');
            const questionIndex = questionsContainer.children.length;
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question');

            questionDiv.innerHTML = `
                <label for="question-${questionIndex}">Question ${questionIndex + 1}:</label>
                <input type="text" id="question-${questionIndex}" required>
                <label for="option1-${questionIndex}">Option 1:</label>
                <input type="text" id="option1-${questionIndex}" required>
                <label for="option2-${questionIndex}">Option 2:</label>
                <input type="text" id="option2-${questionIndex}" required>
                <label for="option3-${questionIndex}">Option 3:</label>
                <input type="text" id="option3-${questionIndex}">
                <label for="option4-${questionIndex}">Option 4:</label>
                <input type="text" id="option4-${questionIndex}">
                <label for="correct-answer-${questionIndex}">Correct Answer:</label>
                <input type="text" id="correct-answer-${questionIndex}" required>
            `;

            questionsContainer.appendChild(questionDiv);
        }

        // Function to load a quiz for attempt
        function loadQuiz(index) {
            const quiz = quizzes[index];
            const quizContent = document.getElementById('quiz-content');
            quizContent.innerHTML = ''; // Clear previous content

            // Create a title for the quiz
            const quizTitle = document.createElement('h3');
            quizTitle.textContent = quiz.title;
            quizContent.appendChild(quizTitle);

            // Iterate over each question and create its structure
            quiz.questions.forEach((question, questionIndex) => {
                const questionDiv = document.createElement('div');
                questionDiv.classList.add('quiz-question');

                // Question text
                const questionText = document.createElement('p');
                questionText.classList.add('question-text');
                questionText.textContent = `${questionIndex + 1}. ${question.text}`;
                questionDiv.appendChild(questionText);

                // Create radio buttons for each option
                question.options.forEach((option, optionIndex) => {
                    const optionWrapper = document.createElement('div');
                    optionWrapper.classList.add('option-wrapper');

                    const optionInput = document.createElement('input');
                    optionInput.type = 'radio';
                    optionInput.name = `question-${questionIndex}`;
                    optionInput.value = option;
                    optionInput.id = `question-${questionIndex}-option-${optionIndex}`;
                    optionInput.classList.add('option-input');

                    const optionLabel = document.createElement('label');
                    optionLabel.setAttribute('for', optionInput.id);
                    optionLabel.classList.add('option-label');
                    optionLabel.textContent = option;

                    optionWrapper.appendChild(optionInput);
                    optionWrapper.appendChild(optionLabel);
                    questionDiv.appendChild(optionWrapper);
                });

                // Append the questionDiv to the quizContent
                quizContent.appendChild(questionDiv);
                quizContent.appendChild(document.createElement('hr')); // Add a horizontal line between questions
            });

            // Show the quiz attempt section
            document.getElementById('quiz-attempt').style.display = 'block';

            // Calculate time limit based on the number of questions
            const timeLimit = quiz.questions.length * 60; // 1 minute per question
            startTimer(timeLimit); // Start the timer with the calculated time limit
        }

        // Function to handle quiz submission
        function submitQuiz() {
            clearInterval(timerInterval); // Clear the timer interval
            const quiz = quizzes[currentQuizIndex];
            const quizContent = document.getElementById('quiz-content');
            const questions = quizContent.querySelectorAll('.quiz-question');

            let score = 0;

            questions.forEach((questionDiv, questionIndex) => {
                const selectedOption = questionDiv.querySelector(`input[name="question-${questionIndex}"]:checked`);

                if (selectedOption) {
                    const userAnswer = selectedOption.value.trim();
                    const correctAnswer = quiz.questions[questionIndex].correctAnswer.trim();

                    console.log(`Question ${questionIndex + 1}:`);
                    console.log(`User Answer: ${userAnswer}`);
                    console.log(`Correct Answer: ${correctAnswer}`);

                    // Compare user's answer with correct answer
                    if (userAnswer === correctAnswer) {
                        score++; // Increment score for each correct answer
                    }
                } else {
                    console.log(`No answer selected for question ${questionIndex + 1}`);
                }
            });

            // Display score
            const totalQuestions = quiz.questions.length;
            const percentage = Math.round((score / totalQuestions) * 100);
            const scoreText = `You scored ${score}/${totalQuestions} (${percentage}%).`;

            let feedbackMessage = '';
            if (percentage >= 80) {
                feedbackMessage = `Excellent! Keep up the good work.`;
            } else if (percentage >= 60) {
                feedbackMessage = `Good effort! You're on the right track.`;
            } else if (percentage >= 40) {
                feedbackMessage = `You can improve. Keep practicing.`;
            } else {
                feedbackMessage = `You should work hard. Review your answers and try again.`;
            }

            document.getElementById('quiz-attempt').style.display = 'none';

            // Show feedback section
            const feedbackSection = document.getElementById('feedback-section');
            feedbackSection.style.display = 'block';
            feedbackSection.innerHTML = `
                <h3>Quiz Results</h3>
                <p>${scoreText}</p>
                <p>${feedbackMessage}</p>
            `;

            // Update high score
            if (score > highestScore) {
                highestScore = score;
            }
            document.getElementById('score-text').textContent = `Highest Score: ${highestScore}`;

            // Reset quiz content
            quizContent.innerHTML = '';
        }

        // Function to submit feedback
        function submitFeedback() {
            const feedbackText = document.getElementById('feedback-text').value.trim();
            if (feedbackText) {
                alert('Thank you for your feedback!');
                document.getElementById('feedback-section').style.display = 'none';
                document.getElementById('feedback-form').reset();
            } else {
                alert('Please enter your feedback.');
            }
        }

        // Function to show modal
        function showModal(message) {
            document.getElementById('alert-message').textContent = message;
            document.getElementById('alert-modal').style.display = 'block';

            setTimeout(() => {
                closeModal();
                submitQuiz(); // Automatically submit the quiz after showing the modal
            }, 3000); // Wait for 3 seconds before auto-submitting
        }

        // Function to close modal
        function closeModal() {
            document.getElementById('alert-modal').style.display = 'none';
        }

        // Event listener for quiz form submission
        document.getElementById('quiz-form').addEventListener('submit', function (event) {
            event.preventDefault();
            const title = document.getElementById('quiz-title').value;
            const questionsContainer = document.getElementById('questions-container');
            const questionElements = questionsContainer.getElementsByClassName('question');

            const questions = Array.from(questionElements).map((questionElement, index) => ({
                text: questionElement.querySelector(`#question-${index}`).value,
                options: [
                    questionElement.querySelector(`#option1-${index}`).value,
                    questionElement.querySelector(`#option2-${index}`).value,
                    questionElement.querySelector(`#option3-${index}`).value,
                    questionElement.querySelector(`#option4-${index}`).value
                ].filter(option => option.trim() !== ''),
                correctAnswer: questionElement.querySelector(`#correct-answer-${index}`).value
            }));

            quizzes.push({ title, questions });
            updateQuizList();
            alert('Quiz created successfully!');
            document.getElementById('quiz-form').reset();
            questionsContainer.innerHTML = '';
        });

        // Event listener for feedback form submission
        document.getElementById('feedback-form').addEventListener('submit', function (event) {
            event.preventDefault();
            submitFeedback();
        });

        // Function to update quiz list
        function updateQuizList() {
            const quizListUl = document.getElementById('quiz-list-ul');
            quizListUl.innerHTML = '';
            quizzes.forEach((quiz, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = quiz.title;
                listItem.addEventListener('click', () => {
                    currentQuizIndex = index;
                    loadQuiz(index);
                });
                quizListUl.appendChild(listItem);
            });
        }

        // Initial call to update quiz list
        updateQuizList();