# Auris - Ouvidoria Digital do IFNMG (Campus Almenara)
---
[![License: NPOSL-3.0](https://img.shields.io/badge/License-NPOSL--3.0-blue.svg)](https://opensource.org/license/nposl-3-0)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Feito com Amor](https://img.shields.io/badge/feito%20com-carinho-red)

Um sistema simples e eficiente para que alunos, servidores e colaboradores possam registrar sugestões, elogios, reclamações e denúncias — tudo de forma prática, digital e (quando necessário) anônima.

> **Nota:** Este guia assume que você está usando uma distribuição Linux.
> 
> Por esse motivo o foco do tutorial é exclusivo para esse sistema operacional, adequando-se às tecnologias utilizadas no IFNMG - Campus Almenara.
> 
> Se estiver utilizando Windows ou MacOS... boa sorte.

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
git clone https://github.com/Fabito02/Auris.git
```


**• Abra a pasta**

```bash
cd 'Auris'
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

**• Execute o backend da aplicação em um servidor local**

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

---

Se algo quebrar, tente reiniciar o servidor.

Se continuar quebrado, provavelmente o culpado está entre o teclado e a cadeira

**Feito com carinho por estudantes do IFNMG — Campus Almenara ❤️.**

## Licença

Este projeto está licenciado sob a [Non-Profit Open Software License 3.0 (NPOSL-3.0)](https://opensource.org/license/nposl-3-0).  
Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
