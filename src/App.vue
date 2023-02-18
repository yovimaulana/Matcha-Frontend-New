<template>  
  <router-view/>  
</template>

<style>
  @font-face {
    font-family: "Montserrat";
    src: url("../public/fonts/Montserrat-Regular.eot");
    src: url("../public/fonts/Montserrat-Regular.eot") format('embedded-opentype'),
        url("../public/fonts/Montserrat-Regular.woff2") format('woff2'),
        url("../public/fonts/Montserrat-Regular.woff") format('woff'),
        url("../public/fonts/Montserrat-Regular.ttf") format('truetype');
    font-weight: 400;
    font-style: normal;
  }

  /* Roboto italic */

  @font-face {
      font-family: "Montserrat";
      src: url('../public/fonts/Montserrat-Italic.eot');
      src: url('../public/fonts/Montserrat-Italic.eot') format('embedded-opentype'),
          url('../public/fonts/Montserrat-Italic.woff2') format('woff2'),
          url('../public/fonts/Montserrat-Italic.woff') format('woff'),
          url('../public/fonts/Montserrat-Italic.ttf') format('truetype');
      font-weight: 400;
      font-style: italic;
  }

  /* Roboto bold */

  @font-face {
      font-family: "Montserrat";
      src: url('../public/fonts/Montserrat-Bold.eot');
      src: url('../public/fonts/Montserrat-Bold.eot') format('embedded-opentype'),
          url('../public/fonts/Montserrat-Bold.woff2') format('woff2'),
          url('../public/fonts/Montserrat-Bold.woff') format('woff'),
          url('../public/fonts/Montserrat-Bold.ttf') format('truetype');
      font-weight: 700;
      font-style: normal;
  }
  /* @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
   */
  /* body {
    font-family: 'Montserrat', sans-serif;
  } */
  /* #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;    
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;

  } */

  /* #nav {
    padding: 30px;
  }

  #nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  } */

</style>