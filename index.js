// modulos externos
const inquirer = require('inquirer')
const chalck = require('chalk')

//modulos internos
const fs = require('fs')

operation()

function operation() {

    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Criar Conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair',
        ]
    }])
        .then((res) => {
            const action = res['action']
            switch (action) {
                case 'Criar Conta':
                    createAccount()
                    break;
                case 'Consultar Saldo':
                    getAccountBalance()
                    break;
                case 'Depositar':
                    deposit()
                    break;
                case 'Sacar':
                    console.log('')
                    break;
                case 'Sair':
                    console.log(chalck.bgBlue.black('Obrigado por usar o accounts'))
                    process.exit()
                    break;
                default:
                    console.log(chalck.bgRed.black('Opção invalida'))

            }
        })
        .catch((err) => console.log(err))
}

//crete an account
function createAccount() {
    console.log(chalck.bgGreen.black('Obrigado por escolher o nosso banco'))
    console.log(chalck.green('Defina as opções da sua conta a seguir'))
    buildAccount()
}

function buildAccount() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para a sua conta: '
        }
    ])
        .then((res) => {
            const accountName = res['accountName']

            console.log(accountName)

            if (!fs.existsSync('accounts')) {
                fs.mkdirSync('accounts')
            }

            if (fs.existsSync(`accounts/${accountName}.json`)) {
                console.log(chalck.bgRed.black('Essa conta já existe escolha outro nome!'))
                buildAccount()
                return
            }
            fs.writeFileSync(`accounts/${accountName}.json`, '{ "balance": 0 }', (err) => {
                console.log(err)
            })
            console.log(chalck.green('Parabéns a sua conta foi criada'))
            operation()
        })
        .catch((err) => console.log(err))
}

//deposita valor
function deposit() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite o nome da sua conta: '
        }
    ])
        .then((res) => {

            const accountName = res['accountName'];

            //verifica se a conta existe
            if (!checkAccount(accountName)) {
                return deposit()
            }

            inquirer.prompt([
                {
                    name: 'amount',
                    message: 'Quando você deseja depositar? '
                }
            ])
                .then((res) => {
                    const amount = res['amount']

                    //adicionar valor
                    addAmount(accountName, amount)
                    operation()
                })
                .catch((err) => console.log(err))

        })
        .catch((err) => console.log(err))

}

function checkAccount(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalck.bgRed.black('Essa conta não existe, tente novamente'))
        return false
    }
    return true
}

function addAmount(accountName, amount) {
    const account = getAccount(accountName)

    if (!amount) {
        console.log(chalck.bgRed.black('Digite um valor'))
        return deposit()
    }

    account.balance = parseFloat(amount) + parseFloat(account.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(account),
        (err) => {
            console.log(err)
        }
    )

    console.log(chalck.green(`Foi depositado o valor de R$ ${amount} na sua conta`))

}

function getAccount(accountName) {
    const accoutJson = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r'
    })
    return JSON.parse(accoutJson)
}

//Consultar saldo
function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite o nome da sua conta'
        }
    ])
        .then((res) => {

            const accountName = res['accountName']

            //verificar se a conta existe
            if (!checkAccount(accountName)) {
                return getAccountBalance()
            }

            const accountData = getAccount(accountName)

            console.log(chalck.bgBlue.black(`Olá o saldo da sua conta é de R$ ${accountData.balance}`))

            operation()


        })
        .catch((err) => console.log(err))
}