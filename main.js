        class Calculator {
            constructor(previousOperandElement, currentOperandElement) {
                this.previousOperandElement = previousOperandElement;
                this.currentOperandElement = currentOperandElement;
                this.clear();
            }

            clear() {
                this.currentOperand = '0';
                this.previousOperand = '';
                this.operation = undefined;
                this.shouldResetScreen = false;
                this.updateDisplay();
            }

            delete() {
                if (this.currentOperand === '0') return;
                this.currentOperand = this.currentOperand.slice(0, -1);
                if (this.currentOperand === '' || this.currentOperand === '-') {
                    this.currentOperand = '0';
                }
                this.updateDisplay();
            }

            toggleSign() {
                if (this.currentOperand === '0') return;
                if (this.currentOperand.startsWith('-')) {
                    this.currentOperand = this.currentOperand.slice(1);
                } else {
                    this.currentOperand = '-' + this.currentOperand;
                }
                this.updateDisplay();
            }

            appendNumber(number) {
                if (this.shouldResetScreen) {
                    this.currentOperand = '0';
                    this.shouldResetScreen = false;
                }

                if (number === '%') {
                    const num = parseFloat(this.currentOperand);
                    if (!isNaN(num)) {
                        this.currentOperand = (num / 100).toString();
                        this.updateDisplay();
                    }
                    return;
                }

                if (number === '.' && this.currentOperand.includes('.')) return;
                if (this.currentOperand === '0' && number !== '.') {
                    this.currentOperand = number;
                } else {
                    this.currentOperand += number;
                }
                this.updateDisplay();
            }

            chooseOperation(operation) {
                if (this.currentOperand === '') return;
                if (this.previousOperand !== '' && !this.shouldResetScreen) {
                    this.compute();
                }
                this.operation = operation;
                this.previousOperand = this.formatNumber(this.currentOperand) + ' ' + operation;
                this.shouldResetScreen = true;
                this.updateDisplay();
            }

            compute() {
                let computation;
                const prev = parseFloat(this.previousOperand);
                const current = parseFloat(this.currentOperand);
                if (isNaN(prev) || isNaN(current)) return;

                switch (this.operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '−':
                    case '-':
                        computation = prev - current;
                        break;
                    case '×':
                        computation = prev * current;
                        break;
                    case '÷':
                        if (current === 0) {
                            this.currentOperand = 'Error';
                            this.previousOperand = '';
                            this.operation = undefined;
                            this.updateDisplay();
                            setTimeout(() => this.clear(), 1500);
                            return;
                        }
                        computation = prev / current;
                        break;
                    default:
                        return;
                }

                // ✅ Allow float precision & trim trailing zeros
                this.currentOperand = parseFloat(computation.toPrecision(12)).toString();

                this.operation = undefined;
                this.previousOperand = '';
                this.shouldResetScreen = true;
                this.updateDisplay();
            }

            formatNumber(number) {
                const stringNumber = number.toString();
                const integerDigits = parseFloat(stringNumber.split('.')[0]);
                const decimalDigits = stringNumber.split('.')[1];
                let integerDisplay;
                if (isNaN(integerDigits)) {
                    integerDisplay = '';
                } else {
                    integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
                }
                if (decimalDigits != null) {
                    return `${integerDisplay}.${decimalDigits}`;
                } else {
                    return integerDisplay;
                }
            }

            updateDisplay() {
                this.currentOperandElement.textContent = this.formatNumber(this.currentOperand);
                this.previousOperandElement.textContent = this.previousOperand;
            }
        }

        const previousOperandElement = document.getElementById('previousOperand');
        const currentOperandElement = document.getElementById('currentOperand');
        const calc = new Calculator(previousOperandElement, currentOperandElement);

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') calc.appendNumber(e.key);
            if (e.key === '.') calc.appendNumber('.');
            if (e.key === '+') calc.chooseOperation('+');
            if (e.key === '-') calc.chooseOperation('−');
            if (e.key === '*') calc.chooseOperation('×');
            if (e.key === '/') {
                e.preventDefault();
                calc.chooseOperation('÷');
            }
            if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                calc.compute();
            }
            if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') calc.clear();
            if (e.key === 'Backspace') calc.delete();
            if (e.key === '%') calc.appendNumber('%');
        });

        // Subtle animation for dots
        setInterval(() => {
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                setTimeout(() => {
                    dot.style.transform = 'scale(1.2)';
                    setTimeout(() => dot.style.transform = 'scale(1)', 200);
                }, index * 100);
            });
        }, 5000);