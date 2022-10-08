function clearScreen() 
{
    document.getElementById('result').value = '';
}

function clearEntry()
{
    let a = document.getElementById('result').value;
    if(a == '') return;
    else document.getElementById('result').value = a.substring(0, a.length - 1);
}

function display(value) 
{
    document.getElementById('result').value += value;
}

function calculate() 
{
    var input = document.getElementById('result').value;
    var tokensArray = input.split('');
    var tokens = Splitter(tokensArray); // turn the array of characters into readable tokens
    var postFix = inToPost(tokens); // switch notation from infix to postfix
    var answer = evaluate(postFix); // evaluate postfix notation
    answer = checkValidity(answer);
    document.getElementById('result').value = answer;
}

function Splitter(input)
{
    var returnTokens = [];
    var i = 0; // iterate through the array of characters
    var operators = ['+','-','*','/','^', '(', ')'];
    while (i < input.length)
    {
        // Helps clean up parenthesis confusion.
        if (input[i] == '{') input[i] = '(';
        if (input[i] == '}') input[i] = ')';
        
        if(operators.indexOf(input[i]) != -1 && input[i] != '-')
        {
            returnTokens.push(input[i]);
            i++;
        }
        else if(input[i] == '-')
        {
            // checks to determine if it is subtraction or negation
            if(i === 0) // if position 0
            {
                returnTokens.push('neg');
                i++;
            }
            else if(input[i-1] == '(') 
            {
                returnTokens.push('neg');
                i++;
            }
            else if (operators.indexOf(input[i-1]) != -1)
            {
                if (input[i-1] != ')')
                {
                    returnTokens.push('neg');
                    i++;
                }
            }
            else
            {
                returnTokens.push('-');
                i++;
            }
        }
        else if(input[i] == 's'|| input[i] == 'c'|| input[i] == 't'|| input[i] == 'l')
        {
            // differentiate which type of function is being expressed and properly push to stack
            let a = '';
            if(input[i] == 's')
            {
                a = 'sin';
                i += 3;
                returnTokens.push(a);
                continue;
            }
            if(input[i] == 'c')
            {
                if(input[i + 2] == 't')
                {
                    a = 'cot';
                    i += 3;
                    returnTokens.push(a);
                    continue;
                }
                else
                {
                    a = 'cos';
                    i += 3;
                    returnTokens.push(a);
                    continue;
                }
            }
            if(input[i] == 't')
            {
                a = 'tan';
                i += 3;
                returnTokens.push(a);
                continue;
            }
            if(input[i] == 'l')
            {
                if(input[i + 1] == 'n')
                {
                    a = 'ln';
                    i += 2;
                    returnTokens.push(a);
                    continue;
                }
                else
                {
                    a = 'log';
                    i += 3;
                    returnTokens.push(a);
                    continue;
                }
            }
            
        }
        else
        {  
            let a = '';
            while(i < input.length)
            {
                //let a = input[i].toString(); // a variable to hold onto the number until we reach a breaking point
                //a = input[i].toString();
                //i++;
                if (!isNaN(input[i]))
                {
                    a += input[i];
                    i++;
                    continue;
                }
                else if (input[i] == '.')
                {
                    a += input[i];
                    i++;
                    continue;
                }
                else break;
            }

            if(a == '') { i++; continue; }
            else returnTokens.push(a);
        }
    }
    return returnTokens;

}

// inspiration for this function from stackoverflow.com/questions/20078413/trouble-with-the-shunting-yard-algorithm
function inToPost(tokens)
{
    var stack = [], list = [], i;
    var operators = ['+','-','*','/','^'];
    var functions = ['sin', 'cos', 'tan', 'cot', 'ln', 'log', 'neg'];
    for(i = 0;  i < tokens.length; i++)
    {
        if(operators.indexOf(tokens[i]) != -1)
        {
            while(stack.length != -1 && getPres(stack[stack.length - 1]) >= getPres(tokens[i]))
                list.push(stack.pop());
            stack.push(tokens[i]);
        }
        else if(functions.indexOf(tokens[i]) != -1)
        {
            while(stack.length != -1 && getPres(stack[stack.length - 1]) >= getPres(tokens[i]))
                list.push(stack.pop());
            stack.push(tokens[i]);
        }
        else if(tokens[i] == '(')
            stack.push('(');
        
        else if(tokens[i] == ')')
        {
            while(stack[stack.length-1] != '(')
            {
                list.push(stack.pop());
                if(stack.length == 0)
                    return 'Perror';
            }
            stack.pop();
        }
        else list.push(tokens[i]); 
    }
        while(stack.length != 0)
        {
            if(stack[stack.length - 1] == '(' || stack[stack.length - 1] == ')')
                return 'Perror';
            else list.push(stack.pop());
        }
         
    return list;
}

function evaluate(tokens)
{
    var i = 0;
    var stack = [];
    var operators = ['+','-','*','/','^'];
    let functions = ['sin', 'cos', 'tan', 'cot', 'ln', 'log', 'neg'];

    if(tokens == 'Perror') return 'Perror';

    for(i = 0; i < tokens.length; i++)
    {
        if(operators.indexOf(tokens[i]) != -1)
        {
            var op1 = stack.pop();
            var op2 = stack.pop();

            var result = performOperation(parseFloat(op1), parseFloat(op2), tokens[i]);
            stack.push(result);
        }
        else if(functions.indexOf(tokens[i]) != -1)
        {
            var op = stack.pop();
            var funcResult = performFunc(parseFloat(op), tokens[i]);
            stack.push(funcResult);
        }
        else stack.push(tokens[i]);
        
    }
    if(stack.length == 1)
        return stack.pop();
    else return 'Multi';
}

// Helper function to perform operations involving two operands
function performOperation(op1, op2, operator)
{
    switch (operator)
    {
        case '+':
            return op1 + op2;
        case '-':
            return op2 - op1;
        case '*':
            return op1 * op2;
        case '/':
            return op2 / op1;
        case '^':
            return Math.pow(op2, op1);
        default:
            return;
    }
}

// Helper function to perform functions involving a singular operand
function performFunc(op, func)
{
    switch (func)
    {
        case 'sin':
            return Math.sin(op);
        case 'cos':
            return Math.cos(op);
        case 'tan':
            return Math.tan(op);
        case 'cot':
            return Math.cot(op);
        case 'log':
            return Math.log10(op)
        case 'ln':
            return Math.log(op);
        case 'neg':
            return -op;
        default:
            return;
    }
}  

// Helper function to get presidence of functions / operations
function getPres(token)
{
    switch(token)
    {
        case 'neg':
            return 6;
        case 'sin':
        case 'cos':
        case 'tan':
        case 'cot':
        case 'ln':
        case 'log':
            return 5;
        case '^':
            return 4;
        case '*':
        case '/':
            return 3;
        case '-':
        case '+':
            return 2;
        default:
            return -1;
    }
}

// Helper function for errors, or NaN answers
function checkValidity(answer)
{
    if(answer == 'Perror')
    {
        alert('Parenthesis balancing error.');
        return '';
    }
    else if(answer == 'Infinity')
    {
        alert('Error. Answer results in: ' + answer + '.');
        return '';
    }
    else if(answer == 'Multi')
    {
        alert('Multiplication error.');
        return '';
    }
    else if(answer.toString() === 'NaN')
    {
        alert('Invalid mathematical equation.');
        return '';
    }
    else return answer;
}