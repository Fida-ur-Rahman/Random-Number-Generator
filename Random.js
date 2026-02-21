       // DOM elements
        const resultElement = document.getElementById('result');
        const generateBtn = document.getElementById('generateBtn');
        const minRangeInput = document.getElementById('minRange');
        const maxRangeInput = document.getElementById('maxRange');
        const allowDecimalsCheckbox = document.getElementById('allowDecimals');
        const allowNegativeCheckbox = document.getElementById('allowNegative');
        const historyList = document.getElementById('historyList');
        const clearHistoryBtn = document.getElementById('clearHistory');
        
        // Initialize history from localStorage or empty array
        let history = JSON.parse(localStorage.getItem('rngHistory')) || [];
        
        // Display initial history
        updateHistoryDisplay();
        
        // Generate random number function
        function generateRandomNumber() {
            let min = parseFloat(minRangeInput.value);
            let max = parseFloat(maxRangeInput.value);
            const allowDecimals = allowDecimalsCheckbox.checked;
            const allowNegative = allowNegativeCheckbox.checked;
            
            // Validate inputs
            if (isNaN(min) || isNaN(max)) {
                alert("Please enter valid numbers for the range");
                return;
            }
            
            // Ensure min is less than max
            if (min > max) {
                [min, max] = [max, min]; // Swap values
                minRangeInput.value = min;
                maxRangeInput.value = max;
            }
            
            // Apply negative number restriction if needed
            if (!allowNegative && min < 0) {
                min = 0;
                minRangeInput.value = 0;
            }
            
            // Generate random number
            let randomNumber;
            if (allowDecimals) {
                randomNumber = Math.random() * (max - min) + min;
                // Round to 4 decimal places
                randomNumber = Math.round(randomNumber * 10000) / 10000;
            } else {
                randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            }
            
            // Display the number with animation
            displayNumberWithAnimation(randomNumber);
            
            // Add to history
            addToHistory(randomNumber, min, max, allowDecimals);
            
            // Save history to localStorage
            localStorage.setItem('rngHistory', JSON.stringify(history));
        }
        
        // Animate number display
        function displayNumberWithAnimation(number) {
            resultElement.classList.add('generating');
            
            // For a more dramatic effect, we can "count" up to the number
            const duration = 300; // ms
            const steps = 20;
            const stepTime = duration / steps;
            const start = parseFloat(resultElement.textContent);
            const increment = (number - start) / steps;
            let currentStep = 0;
            
            const counter = setInterval(() => {
                currentStep++;
                const currentValue = start + (increment * currentStep);
                
                // Format the display
                if (Number.isInteger(number)) {
                    resultElement.textContent = Math.round(currentValue);
                } else {
                    resultElement.textContent = currentValue.toFixed(4);
                }
                
                if (currentStep >= steps) {
                    clearInterval(counter);
                    resultElement.textContent = number;
                    resultElement.classList.remove('generating');
                }
            }, stepTime);
        }
        
        // Add generated number to history
        function addToHistory(number, min, max, isDecimal) {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            const historyItem = {
                number: number,
                min: min,
                max: max,
                isDecimal: isDecimal,
                time: timeString,
                timestamp: now.getTime()
            };
            
            // Add to beginning of array
            history.unshift(historyItem);
            
            // Keep only last 20 items
            if (history.length > 20) {
                history = history.slice(0, 20);
            }
            
            updateHistoryDisplay();
        }
        
        // Update the history list display
        function updateHistoryDisplay() {
            // Clear the list
            historyList.innerHTML = '';
            
            if (history.length === 0) {
                historyList.innerHTML = '<li style="text-align: center; color: #888;">No numbers generated yet</li>';
                return;
            }
            
            // Add each history item to the list
            history.forEach(item => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <div>
                        <span class="history-number">${item.number}</span>
                        <span class="history-range"> (${item.min} to ${item.max})</span>
                    </div>
                    <div class="history-time">${item.time}</div>
                `;
                historyList.appendChild(listItem);
            });
        }
        
        // Clear history function
        function clearHistory() {
            if (history.length === 0) return;
            
            if (confirm("Are you sure you want to clear the history?")) {
                history = [];
                localStorage.removeItem('rngHistory');
                updateHistoryDisplay();
            }
        }
        
        // Event listeners
        generateBtn.addEventListener('click', generateRandomNumber);
        clearHistoryBtn.addEventListener('click', clearHistory);
        
        // Allow pressing Enter to generate a number
        document.addEventListener('keydown', function(event) {
            if (event.code === 'Enter' || event.code === 'Space') {
                generateRandomNumber();
            }
        });
        
        // Validate range inputs
        minRangeInput.addEventListener('change', function() {
            let min = parseFloat(this.value);
            let max = parseFloat(maxRangeInput.value);
            
            if (!allowNegativeCheckbox.checked && min < 0) {
                this.value = 0;
            }
            
            if (min > max) {
                maxRangeInput.value = min + 1;
            }
        });
        
        maxRangeInput.addEventListener('change', function() {
            let min = parseFloat(minRangeInput.value);
            let max = parseFloat(this.value);
            
            if (!allowNegativeCheckbox.checked && max < 0) {
                this.value = 0;
                if (min > 0) minRangeInput.value = -1;
            }
            
            if (max < min) {
                minRangeInput.value = max - 1;
            }
        });
        
        // Handle negative number checkbox
        allowNegativeCheckbox.addEventListener('change', function() {
            if (!this.checked) {
                // If not allowing negatives, set any negative values to 0
                if (parseFloat(minRangeInput.value) < 0) minRangeInput.value = 0;
                if (parseFloat(maxRangeInput.value) < 0) maxRangeInput.value = 0;
            }
        });
        
        // Generate initial random number on page load
        window.addEventListener('load', function() {
            setTimeout(() => {
                generateRandomNumber();
            }, 500);
        });