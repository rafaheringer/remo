Agradecimentos
--------------

0. 	[github/jquery](https://github.com/jquery/jquery) - O que seria do desenvolvedor web sem ele?
1.	[github/happyworm/jPlayer](https://github.com/happyworm/jPlayer) - Player de áudio cross-browser completo. Utilizado como base do player.
2.	[github/migerh/fileapi](https://github.com/migerh/js-experiments/tree/master/fileapi/) - Exemplo de funcionamento da API web-audio com exemplo de drag-and-drop. Muito útil para estudos e implementação no player.
3.	[github/mddrylliog/jsmad](https://github.com/nddrylliog/jsmad) - Grandioso projeto de implementação do decode de MP3 em javascript. Base de estudos do funcionamento de MP3 e do file-reader API.
4.	[github/jeromeetienne/jquery-qrcode](https://github.com/jeromeetienne/jquery-qrcode) - Biblioteca simples e prática para criação de qrCodes em javascript
5.	[github/jrburke/requirejs](https://github.com/jrburke/requirejs) - Ótimo gerenciador de scripts assíncronos e dependências.

HEROKU
------

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

(continuar...)