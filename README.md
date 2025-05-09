# Auris - Ouvidoria Digital IFNMG - Almenara

## Etapas de configuração do dispositivo para o uso da aplicação local

### Requisitos:

**• Git**

ArchLinux

```bash
sudo pacman -S git
```

Fedora

```bash
sudo dnf install git
```

Ubuntu e derivados

```bash
sudo apt install git
```


**• Npm e Node.js**

ArchLinux

```bash
sudo pacman -S nodejs npm
```

Fedora

```bash
sudo dnf install nodejs npm
```

Ubuntu e derivados

```bash
sudo apt install nodejs npm
```


**• Mysql**

Arch Linux

```bash
sudo pacman -S mysql
sudo mysql_install_db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
sudo systemctl enable --now mysqld
```

Fedora

```bash
sudo dnf install mysql-server
sudo systemctl enable --now mysqld
```

Ubuntu e derivados

```bash
sudo apt install mysql-server
sudo systemctl enable --now mysql
```

Configure sua senha:

```bash
sudo mysql_secure_installation
```

### Clonagem do repositório e configuração do ambiente:


**• Clone o repositório**

```bash
git clone https://github.com/Fabito02/Ouvidoria_Digital_IFNMG-Almenara.git
```


**• Abra a pasta**

```bash
cd 'Ouvidoria_Digital_IFNMG-Almenara'
```


**• Abra a pasta "frontend" e execute a instalação das dependências**

```bash
cd frontend
npm install
```

Aguarde a instalação finalizar

**• Execute o frontend da aplicação em um servidor local**

```bash
npm run dev
```

**• Abra a pasta "backend" e execute a instalação das dependências**

```bash
cd backend
npm install
```

Aguarde a instalação finalizar

**• Execute o frontend da aplicação em um servidor local**

```bash
npm run dev
```

---

### Configurar banco de dados

**• Entre no terminal do Mysql como root**

```bash
mysql -u root -p
```

**• Crie o Banco de Dados**

```sql
CREATE DATABASE Auris;
```

**• Saia do terminal do Mysql**

```sql
exit
```

**• Entre novamente no Backend**

```bash
cd backend
```

**• Crie seu arquivo .env com base no arquivo de exemplo**

```bash
cp .env_exemplo .env
```

**• Edite o arquivo**

 - troque "SUA_SENHA_AQUI" pela senha que você configurou no Mysql
 - troque "sua_chave_secreta_muito_forte_aqui" por uma chave secreta aleatória
 
Você pode gerar uma chave com o comando 

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Agora abra o arquivo .env para adicionar os valores.

```bash
nano .env
```

* CTRL + S para salvar e CTRL + X para sair (isso pode ser feito graficamente utilizando o Vscode ou um editor de texto qualquer)

**• Faça a execução das seeds para povoar o Banco de Dados**

```bash
npm run seed
```

***Após isso o banco de dados já estará configurado e com dados pré-definidos para a execução de testes.**


## Enviando alterações

**• Adicionar as alterações**

Faça as modificações que precisar no código e adicione as mudanças:

```bash
git add .
```


## Comitar as alterações

**• Depois de adicionar os arquivos, faça o commit com uma mensagem descritiva:**

Ex:
```bash
git commit -m "feat: Adicionando minha nova feature"
```

***OBS: Esta parte pode ser feita de forma gráfica pelo Visual Studio Code**
