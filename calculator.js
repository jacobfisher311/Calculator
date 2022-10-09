// Helper function that clears the screen when the 'C' button is pressed.
function clearScreen() 
{
    document.getElementById('result').value = '';
}

// Helper function to remove the current input by 1, removed when the 'CE' button is pressed.
function clearEntry()
{
    let a = document.getElementById('result').value;
    if(a == '') return;
    else document.getElementById('result').value = a.substring(0, a.length - 1);
}

// Helper function to display the value that the user inputs.
function display(value) 
{
    document.getElementById('result').value += value;
}

// Function that is called when the user presses the '=' button.
function calculate() 
{
    var input = document.getElementById('result').value;
    var tokensArray = input.split('');        // Turn the value in the textbox into an array of singular characters.
    var tokens = Splitter(tokensArray);       // Turn the array of characters into readable tokens.
    var postFix = inToPost(tokens);           // Switch notation from infix to postfix.
    var answer = evaluate(postFix);           // Evaluate postfix notation.
    answer = checkValidity(answer);           // Check validity of the evaluated notation for 'NaN' or 'Infinity.'
    document.getElementById('result').value = answer;
}

// Function to split the data into readable tokens, specifically designed for numbers that take up more than a single space.
function Splitter(input)
{
    var i = 0, returnTokens = [];
    var operators = ['+','-','*','/','^', '(', ')'];
    while(i < input.length)
    {
        // Clean up parenthesis confusion.
        if(input[i] == '{') input[i] = '(';
        if(input[i] == '}') input[i] = ')';
        
        if(operators.indexOf(input[i]) != -1 && input[i] != '-')
        {
            returnTokens.push(input[i]);
            i++;
        }
        
        // Check to determine if '-' is negation or subtraction.
        else if(input[i] == '-')
        {
            // If '-' is the first value in the array.
            if(i === 0)                                   
            {
                returnTokens.push('neg');
                i++;
            }

            // If previous character is open parenthesis.
            else if(input[i-1] == '(')                    
            {
                returnTokens.push('neg');
                i++;
            }

            // If previous character was an operator.
            else if(operators.indexOf(input[i-1]) != -1) 
            {
                if(input[i-1] != ')')
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

        // Differentiate the type of functions and properly push to stack.
        else if(input[i] == 's'|| input[i] == 'c'|| input[i] == 't'|| input[i] == 'l')
        {
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

        // Inputs that are not operators or functions.
        else
        {  
            let a = '';
            while(i < input.length)
            {
                if(!isNaN(input[i]) || input[i] == '.')
                {
                    a += input[i];
                    i++;
                    continue;
                }
                else break;
            }
            if(a == '') 
            { 
                i++; 
                continue; 
            }
            else returnTokens.push(a);
        }
    }
    return returnTokens;

}

// Inspiration for this function from stackoverflow.com/questions/20078413/trouble-with-the-shunting-yard-algorithm
function inToPost(tokens)
{
    var stack = [], list = [], i;
    var operators = ['+','-','*','/','^'];
    var functions = ['sin', 'cos', 'tan', 'cot', 'ln', 'log', 'neg'];
    for(i = 0;  i < tokens.length; i++)
    {
        // If the current token is an operator.
        if(operators.indexOf(tokens[i]) != -1)
        {
            while(stack.length != -1 && getPres(stack[stack.length - 1]) >= getPres(tokens[i]))
                list.push(stack.pop());
            stack.push(tokens[i]);
        }
        
        // If the current token is a function.
        else if(functions.indexOf(tokens[i]) != -1)
        {
            while(stack.length != -1 && getPres(stack[stack.length - 1]) >= getPres(tokens[i]))
                list.push(stack.pop());
            stack.push(tokens[i]);
        }
        
        // If the current token is an open parenthesis.
        else if(tokens[i] == '(')
            stack.push('(');
        
        // If the current token is a close parenthesis.
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
    } // End of for loop

    // Check for parenthesis mismatch within the stack.    
    while(stack.length != 0)
    {
        if(stack[stack.length - 1] == '(' || stack[stack.length - 1] == ')')
            return 'Perror';
        else list.push(stack.pop());
    }     
    return list;
}

// Function to evaluate the PostFix notation and provide the user with an accurate answer.
function evaluate(tokens)
{
    var i = 0, stack = [];
    var operators = ['+','-','*','/','^'];
    let functions = ['sin', 'cos', 'tan', 'cot', 'ln', 'log', 'neg'];

    // If there is a parenthesis mismatch, no need to evaluate the expression.
    if(tokens == 'Perror') return 'Perror';

    for(i = 0; i < tokens.length; i++)
    {
        // If the current token is an operator.
        if(operators.indexOf(tokens[i]) != -1)
        {
            var op1 = stack.pop();
            var op2 = stack.pop();

            var result = performOperation(parseFloat(op1), parseFloat(op2), tokens[i]);
            stack.push(result);
        }

        // If the current token is a function.
        else if(functions.indexOf(tokens[i]) != -1)
        {
            var op = stack.pop();
            var funcResult = performFunc(parseFloat(op), tokens[i]);
            stack.push(funcResult);
        }
        else stack.push(tokens[i]);
        
    }
    
    // If there is more than one item on the stack, the math was not performed to completion.
    // Generally this happens when the user attempts to input 7(8) or 7sin(8).
    // Solution is to request that the user expressly defines multiplication with '*' operator.
    if(stack.length == 1)
        return stack.pop();
    else return 'NaN';
}

// Helper function to perform operations involving two operands
function performOperation(op1, op2, operator)
{
    switch(operator)
    {
        case '+':
            return op2 + op1;
        case '-':
            return op2 - op1;
        case '*':
            return op2 * op1;
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
    switch(func)
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
    else if(answer.toString() === 'NaN')
    {
        alert('Invalid mathematical equation.');
        return '';
    }
    else return answer;
}