<template>
    <div style="background-color: white;">
        <span style="font-size: 300px;font-weight: 900;position:relative;  top:80px;">4</span> <img
            src="../assets/matcha404.png" class="hvr-bob mybob p-mt-1 " style="width: 12%; height: 18%;" alt=""
            srcset=""><span style="font-size: 300px;font-weight: 900;position:relative;  top:80px;">4</span><br>

    </div>
    <br>
    <h1 style="font-size: 70px;position:relative;  top:-70px;">PAGE NOT FOUND asd</h1>
    <h1>Aww...Jangan Nangis.</h1>
    <h3>Ini cuma error 404! Ayo kerja lagi.</h3>
    <p  style="font-style: italic; ">
    <span>So little time, so <span style="font-weight: 900;color:#78b34d"> MatchA </span> to do</span></p>
    <router-link to="/">
        <!-- <Button style="font-weight: 900;border-radius: 14px;" label="Skip" icon="pi pi-forward"
            class=" p-button-success      p-ripple p-button-lg " @click="skip()">
            <i class="pi pi-home p-mr-2"></i> MatchA </Button> -->
    </router-link>
</template>
<style scoped>
    /* Bob */
    @-webkit-keyframes hvr-bob {
        0% {
            -webkit-transform: translateY(-14px);
            transform: translateY(-14px);
        }

        50% {
            -webkit-transform: translateY(-4px);
            transform: translateY(-4px);
        }

        100% {
            -webkit-transform: translateY(-14px);
            transform: translateY(-14px);
        }
    }

    @keyframes hvr-bob {
        0% {
            -webkit-transform: translateY(-14px);
            transform: translateY(-14px);
        }

        50% {
            -webkit-transform: translateY(-4px);
            transform: translateY(-4px);
        }

        100% {
            -webkit-transform: translateY(-14px);
            transform: translateY(-14px);
        }
    }

    @-webkit-keyframes hvr-bob-float {
        100% {
            -webkit-transform: translateY(-14px);
            transform: translateY(-14px);
        }
    }

    @keyframes hvr-bob-float {
        100% {
            -webkit-transform: translateY(-14px);
            transform: translateY(-14px);
        }
    }

    .hvr-bob {
        display: inline-block;
        vertical-align: middle;
        -webkit-transform: perspective(1px) translateZ(0);
        transform: perspective(1px) translateZ(0);
        box-shadow: 0 0 1px rgba(0, 0, 0, 0);
    }

    .hvr-bob,
    .hvr-bob,
    .hvr-bob {
        -webkit-animation-name: hvr-bob-float, hvr-bob;
        animation-name: hvr-bob-float, hvr-bob;
        -webkit-animation-duration: .3s, 1.5s;
        animation-duration: .3s, 1.5s;
        -webkit-animation-delay: 0s, .3s;
        animation-delay: 0s, .3s;
        -webkit-animation-timing-function: ease-out, ease-in-out;
        animation-timing-function: ease-out, ease-in-out;
        -webkit-animation-iteration-count: 1, infinite;
        animation-iteration-count: 1, infinite;
        -webkit-animation-fill-mode: forwards;
        animation-fill-mode: forwards;
        -webkit-animation-direction: normal, alternate;
        animation-direction: normal, alternate;
    }
</style>