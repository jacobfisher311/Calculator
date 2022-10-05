function clearScreen() 
{
    document.getElementById("result").value = "";
}
 
function display(value) 
{
    document.getElementById("result").value += value;
}

function calculate() 
{
    var input = document.getElementById("result").value;
    var tokensArray = input.split("");
    var tokens = Splitter(tokensArray);
    document.getElementById("test").textContent = tokens; // turn the array of characters into readable tokens
    var postFix = inToPost(tokens);
    var answer = evaluate(postFix);

    //document.getElementById("test").textContent = tokensArray; // change "test" to "result"
    document.getElementById("result").value = "";
}

function Splitter(input)
{
    var returnTokens = [];
    var i = 0; // iterate through the array of characters
    var operators = ['+','-','*','/','^','(',')', '{', '}'];

    while (i < input.length)
    {
        if(operators.indexOf(input[i]) != -1 && input[i] != '-')
        {
            returnTokens.push(input[i]);
        }
        else if(input[i] == '-')
        {
            if(i === 0)
            {
                returnTokens.push('neg');
                i++;
            }
            else if(input[i-1] == '(' || input[i-1] == '{')
            {
                returnTokens.push('neg');
                i++;
            }
            else if(input[i - 1] != ')' || input[i - 1] !=  '}')
            {
                if(operators.indexOf(input[i-1] != -1))
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
        else
        {
            
            // match i to /-?[0-9]+(\.[0-9]+)?/ --?
            let a = ""; // a variable to hold onto the number until we reach a breaking point
            while(i < input.length && operators.indexOf(input[i] == -1))
            {
                
                a += input[i];
                i++;
            }
            returnTokens.push(a);
        }
    }
    return returnTokens;

}
function inToPost(token)
{

}

function evaluate(tokens)
{
    let iterator = 0;
    while (iterator < tokens.length)
    {
        var currToken = tokens[iterator];

        if (isNum(currToken))
        {
            stack.push(currToken);
        }
        else if (isOperator(currToken))
        {
            var op1 = stack.pop();
            var op2 = stack.pop();

            var result = performOperation(parseInt(op1), parseInt(op2), currToken);
            stack.push(result);
        }
        else if (isFunc(currToken))
        {

        }
        iterator++;
    }
    let a = stack.pop();
    // document.getElementById("result").value = a;
}
function isOperator(token)
{
    if(!token.match(/([*+-\/])/))
        return false;
    else 
        return true;
    
}

function performOperation(op1, op2, operator)
{
    switch (operator)
    {
        case '+':
            return op1 + op2;
        case '-':
            return op1 - op2;
        case '*':
            return op1 * op2;
        case '/':
            return op1 / op2;
        default:
            return;

        /* unary operators
        case 'sin(':
        case 'cos(':
        case 'tan(':
        case 'cot(':
        case 'log':
        case 'ln':
        case '^':
        */ 
    }
}

function isNum(token)
{
    if (token.match(/-?[0-9]+(\.[0-9]+)?/))
        return true;
    else 
        return false;
}
    // Function to acquire the presidence of the operator
function getPres(token)
{
    switch(token)
    {
        case 'neg':
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

function isFunc(token)
{
    switch(token)
    {
        case 's':
        case 'c':
        case 't':
        case 'l':
            return true;
        default:
            return false;

    }
}

function getAssoc(token)
{
    switch(token)
    {
        case '+':
        case '-':
        case '*':
        case '/':
            return 'left';
        case '^':
        case 'sin':
        case 'cos':
        case 'tan':
        case 'cot':
        case 'ln':
        case 'log':
            return 'right';
    }
}