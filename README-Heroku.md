Heroku Build
============

Para testes, o sistema sempre tem um deploy para o heroku. Você pode conferir o deploy em: [http://remomusic.herokuapp.com/](http://remomusic.herokuapp.com/). Todos os passos a seguir estão no [DevCenter](https://devcenter.heroku.com/articles/nodejs).

**Processo de cadastro no heroku:**

0.  O Primeiro passo é se cadastrar no site [Heroku](http://heroku.com). Você receberá um email de confirmação e as primeiras instruções. Para funcionar, seu projeto já deve estar hospedado em algum servidor GIT.
1.  Depois deverá baixar o [Heroku Toolbelt](https://toolbelt.heroku.com/). Este é o cliente Heroku para se usar no Windows, Linux ou Mac.
2.	Após, abra o terminal e logue-se com sua conta no heroku:   
	
	```
	heroku login
	```
3.	A partir daí vamos criar nosso primeiro aplicativo no heroku. Vá pelo terminal até a pasta do seu aplicativo local. Crie um arquivo chamdo "Procfile" contendo as instruções de inicialização do aplicativo. Normalmente é algo parecido como:   
	
	```
	web: node app.js
	```
4.	Vamos iniciar o git nesta pasta e comitar o Procfile. o Heroku utiliza a última versão do código que está no seu servidor GIT.   
	
	```
	git init
	git add .
	git commit -m "Procfile for Heroku"
	```
5.	Agora sim vamos criar o nosso primeiro aplicativo no Heroku. Para isso, basta executar o seguinte comando:
	
	```
	heroku create
	```
	Vai ser criado um aplicativo com nome aleatório que você poderá modificar posteriormente no site. A partir daí começa o processo de deploy, explicado nos próximos passos.

**Para fazer o deploy:**

0.	Logue-se no heroku:   
	
	```
	heroku login
	```
1.	Faça o commit de todos os seus arquivos alterados no GIT e faça o push no heroku:
	
	```
	git push heroku master
	```
	Caso falhe por conta de permissão, execute o seguinte comando, vá até a pasta .ssh (C:\User\YourName\.ssh) e faça uma cópia do github_rsa para id_rsa. Depois execute: `heroku keys:add`
2.	Para iniciar a aplicação, basta executar o scale:
	
	```
	heroku ps:scale web=1
	```
	Pronto! Você pode ver o status da aplicação com `heroku ps` e pode abri-la no navegador com `heroku open`
(continuar...)