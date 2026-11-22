const result = document.getElementById('result');
const ERROR_STATES = new Set(['Error', 'Infinity', '-Infinity', 'NaN']);
const OPERATORS = new Set(['+', '-', '*', '/']);

function resetIfError() {
    if (ERROR_STATES.has(result.value)) {
        result.value = '';
    }
}

function getCurrentNumberSegment(expr) {
    let i = expr.length - 1;
    while (i >= 0 && !OPERATORS.has(expr[i])) {
        i--;
    }
    return expr.slice(i + 1);
}

function appendNumber(number) {
    resetIfError();
    if (number === '.') {
        const segment = getCurrentNumberSegment(result.value);
        if (segment.includes('.')) return;
        if (segment === '') {
            result.value += '0.';
            return;
        }
    }
    result.value += number;
}

function appendOperator(operator) {
    resetIfError();
    const current = result.value;
    if (!current) {
        if (operator === '-') {
            result.value = '-';
        }
        return;
    }

    const lastChar = current[current.length - 1];
    if (OPERATORS.has(lastChar)) {
        if (current.length === 1 && lastChar === '-') return;
        result.value = current.slice(0, -1) + operator;
        return;
    }

    if (lastChar === '.') {
        result.value = current.slice(0, -1) + operator;
        return;
    }

    result.value += operator;
}

function evaluateExpression(expr) {
    const tokens = [];
    let i = 0;

    while (i < expr.length) {
        const ch = expr[i];
        if (ch === ' ') {
            i++;
            continue;
        }

        const isUnaryMinus =
            ch === '-' &&
            (tokens.length === 0 || typeof tokens[tokens.length - 1] === 'string');

        if ((ch >= '0' && ch <= '9') || ch === '.' || isUnaryMinus) {
            let numStr = ch;
            i++;
            while (i < expr.length && ((expr[i] >= '0' && expr[i] <= '9') || expr[i] === '.')) {
                numStr += expr[i];
                i++;
            }
            const num = Number(numStr);
            if (!Number.isFinite(num)) {
                throw new Error('Invalid number');
            }
            tokens.push(num);
            continue;
        }

        if (OPERATORS.has(ch)) {
            tokens.push(ch);
            i++;
            continue;
        }

        throw new Error('Unexpected character');
    }

    if (tokens.length === 0) return '';
    if (typeof tokens[tokens.length - 1] === 'string') {
        throw new Error('Trailing operator');
    }

    // First pass: * and /
    const pass1 = [tokens[0]];
    for (let j = 1; j < tokens.length; j += 2) {
        const op = tokens[j];
        const nextVal = tokens[j + 1];
        if (typeof nextVal !== 'number') throw new Error('Malformed expression');

        if (op === '*' || op === '/') {
            const prevVal = pass1.pop();
            if (op === '/' && nextVal === 0) {
                throw new Error('Division by zero');
            }
            pass1.push(op === '*' ? prevVal * nextVal : prevVal / nextVal);
        } else {
            pass1.push(op, nextVal);
        }
    }

    // Second pass: + and -
    let total = pass1[0];
    for (let j = 1; j < pass1.length; j += 2) {
        const op = pass1[j];
        const nextVal = pass1[j + 1];
        total = op === '+' ? total + nextVal : total - nextVal;
    }

    if (!Number.isFinite(total)) {
        throw new Error('Overflow');
    }

    return String(Number(total.toPrecision(12)));
}

function calculateResult() {
    if (!result.value || ERROR_STATES.has(result.value)) return;
    try {
        result.value = evaluateExpression(result.value);
    } catch {
        result.value = 'Error';
    }
}

function clearResult() {
    result.value = '';
}

function deleteLast() {
    resetIfError();
    result.value = result.value.slice(0, -1);
}

document.addEventListener('keydown', (event) => {
    const { key } = event;
    if (key >= '0' && key <= '9') {
        event.preventDefault();
        appendNumber(key);
    } else if (key === '.') {
        event.preventDefault();
        appendNumber('.');
    } else if (OPERATORS.has(key)) {
        event.preventDefault();
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculateResult();
    } else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        event.preventDefault();
        clearResult();
    }
});
