<template>
    <div class="p-grid p-p-0 p-p-sm-1 p-p-md-2 p-p-lg-3">        
        <div class="p-col-12 p-lg-12">
            <Breadcrumb class="custom-breadcrumb" :home="home" :model="items" />
        </div>
        <Card class="custom-card-matcha">
            <template #title>
                <div class="p-grid">
                    <div class="p-col-6">
                        <div style="font-size: 1rem">Progres Kegiatan</div>
                    </div>
                    <div class="p-col-6" style="text-align: right">
                        <Dropdown @change="getProgressKegiatanUser(yearSelected)" v-model="yearSelected" :options="yearOption" optionLabel="name" placeholder="Pilih Tahun Kegiatan" />
                    </div>
                </div>
            </template>
            <template #content>
                <Skeleton v-show="onLoadData" height="15rem" />
                <DataTable v-if="kegiatanData != null" :value="kegiatanData.data.users" responsiveLayout="scroll"
                    class="animate__animated animate__fadeIn"
                    style="border-radius: 18px;">
                    <template #empty>
                        <h5>Data tidak tersedia!</h5>
                    </template>
                    <Column field="nama_kegiatan" header="Nama Kegiatan"></Column>
                    <Column field="jumlah_matching" header="Jumlah Matching">
                        <template #body="col">
                            {{col.data.jumlah_matching}} <i v-if="col.data.sisa_matching == '0'" @click="this.downloadReport(col)" class="pi pi-download" style="cursor: pointer; color: green; margin-left: 10px;" v-tooltip.top="'Click to download Report (max: 1000 rows)!'"></i>                            
                        </template>
                    </Column>
                    <Column field="sisa_matching" header="Sisa Matching"></Column>
                    <Column field="jumlah_assessment" header="Jumlah Assessment">
                        <template #body="col">
                            {{col.data.jumlah_assessment}} <i v-if="col.data.sisa_assessment == '0'"  @click="this.downloadReport(col)" class="pi pi-download" style="cursor: pointer; color: green; margin-left: 10px;" v-tooltip.top="'Click to download Report (max: 1000 rows)!'"></i>                            
                        </template>
                    </Column>
                    <Column field="sisa_assessment" header="Sisa Assessment "></Column>
                </DataTable>
                <div v-show="onErrorLoad" style="text-align: center">
                    <img class="errImg" src="../assets/err404.png" alt="Error Image">                    
                    <Button @click="this.getKegiatanDataUser()" v-tooltip.right="'Click to reload data!'" class="p-button-danger p-button-outlined onclick-btn-custom" style="margin-top: 5px; margin-bottom: 15px" label="RELOAD" icon="pi pi-refresh" />
                </div>                     
            </template>
        </Card>
        <Toast />
        <Loading v-model:active="loadingDialog" :is-full-page="true" :color="'#86d166'" :background-color="'black'"
            :opacity="0.75">
            <slot>
                <MyLoading></MyLoading>
            </slot>
        </Loading>  
    </div>
</template>

<script scoped>
    import Breadcrumb from 'primevue/breadcrumb';
    import DataService from '../services/DataService';
    import Card from 'primevue/card';
    import Skeleton from 'primevue/skeleton';
    import Button from 'primevue/button';
    import Toast from 'primevue/toast';
    import exportFromJSON from "export-from-json";
    import MyLoading from '../components/MyLoading2.vue'
    import Loading from 'vue-loading-overlay';
    import 'vue-loading-overlay/dist/vue-loading.css';
    // import UserService from '../services/UserService'
    export default {
        components: {
            Breadcrumb,
            Card,
            Skeleton,
            Button,
            Toast,
            exportFromJSON,
            Loading,
            MyLoading
        },
        data() {
            return {
                home: {
                    icon: 'pi pi-home',
                    to: '/'
                },
                items: [{
                        label: 'Dashboard'
                    },

                ],
                yearOption: [
                    {name: '2022', value: '2022'},
                    {name: '2023', value: '2023'},
                    {name: '2024', value: '2024'},
                    {name: '2025', value: '2025'},
                    {name: '2026', value: '2026'},
                    {name: '2027', value: '2027'},
                    {name: '2028', value: '2028'},
                    {name: 'Show All', value: ''}
                ],
                yearSelected: null,
                kegiatanData: null,
                onLoadData: false,
                onErrorLoad: false,
                loadingDownload: false, 
                loadingDialog: false              
            }
        },
        watch: {},
        async created() {
            const token = localStorage.getItem('token');
            await this.$store.dispatch('get_user', token)   
            this.yearSelected = this.yearOption.find(data => data.value == new Date().getFullYear())           
            await this.getKegiatanDataUser(new Date().getFullYear())
        },

        computed: {            
            currentUser() {
                return this.$store.state.auth.user
            }
        },
        methods: {
            async getKegiatanDataUser(year) {
                this.onLoadData = true
                this.onErrorLoad = false
                this.kegiatanData = null
                try {
                    const result = await DataService.getKegiatanDataUser(this.currentUser.id, year)
                    
                    if(result.data.meta.status == 'error') throw new Error(result.data.meta.message)
                    
                    this.onLoadData = false
                    this.onErrorLoad = false                        
                    this.kegiatanData = result.data
                } catch (error) {
                    this.onLoadData = false
                    this.onErrorLoad = true
                    this.$toast.add({severity:'error', summary: 'Error Occured!', detail:'Gagal menampilkan data :(', life: 3000});
                    console.log(error)
                }               
            },
            getProgressKegiatanUser(year) {
                this.getKegiatanDataUser(year.value)
            },
            async downloadReport(dataReport) {
                
                try {
                    // this.loadingDownload = true
                    this.loadingDialog = true
                    const result = await DataService.getReportMatchingUser(this.currentUser.id, dataReport.data.id, (dataReport.field == 'jumlah_matching' ? 'matching' : 'assessment'))
                    
                    // export to csv
                    const data = result.data.data
                    const fileName = `[REPORT MATCHA] ${dataReport.field == 'jumlah_matcing' ? 'MATCHING' : 'ASSESSMENT'} - `+dataReport.data.nama_kegiatan.toUpperCase();
                    const exportType = exportFromJSON.types.csv;
                    if (data) exportFromJSON({ data, fileName, exportType });

                    // this.loadingDownload = false     
                    this.loadingDialog = false          
                } catch (error) {
                    this.$toast.add({severity:'error', summary: 'Error Occured!', detail:'Something went wrong!', life: 3000});
                    // this.loadingDownload = false
                    this.loadingDialog = false
                    console.log(error)
                }
            }

        }
    }
</script>

<style scoped>

    /* .background-svg {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1012%26quot%3b)' fill='none'%3e%3cpath d='M122.72 0C141.75 5.76 120.65 38.46 140 42.42C199.29 54.55 211.58 44.78 280 32.18C326.74 23.57 324.21 10.6 370.32 0C394.21 -5.49 395.16 0 420 0C444.84 0 446.06 -6.22 469.68 0C516.06 12.2 512.97 33.27 560 36.84C628.13 42.02 633.57 33.41 700 17.5C710.47 14.99 703.29 1.31 713.8 0C773.29 -7.44 776.9 0 840 0C910 0 910 0 980 0C1050 0 1050 0 1120 0C1190 0 1190 0 1260 0C1330 0 1330 0 1400 0C1470 0 1505 -35 1540 0C1575 35 1540 70 1540 140C1540 210 1540 210 1540 280C1540 337.27 1560.65 351.53 1540 394.55C1527.05 421.53 1472.8 408.21 1472.8 420C1472.8 431.57 1527.48 415.19 1540 441.27C1561.08 485.19 1572.12 532.76 1540 560C1502.12 592.12 1470 560 1400 560C1330 560 1330 560 1260 560C1190 560 1190 560 1120 560C1050 560 1050 560 980 560C910 560 910 560 840 560C784.45 560 779.92 570.77 728.91 560C709.92 555.99 714.54 530.44 700 530.44C685.3 530.44 689.66 555.94 670.44 560C619.66 570.72 615.22 560 560 560C500.12 560 468.15 592.27 440.24 560C407.61 522.27 447.13 487.53 438.92 420C437.01 404.32 434.87 397.73 420 393.58C355.41 375.56 341.17 403.88 280 375.67C218.02 347.09 222.83 331.31 173.7 280C152.83 258.2 160.52 229.44 140 229.44C113.33 229.44 89.72 245.64 79.33 280C60.9 340.92 66 353.98 82.35 420C96.34 476.48 97.22 517.62 140 525C196.05 534.67 215.99 445.36 280 454.1C344.16 462.86 396.34 529.56 396.34 560C396.34 582.51 338.17 560 280 560C210 560 210 560 140 560C70 560 35 595 0 560C-35 525 0 490 0 420C0 350 0 350 0 280C0 210 0 210 0 140C0 70 -32.7 37.3 0 0C28.66 -32.7 71.75 -15.45 122.72 0' stroke='rgba(167%2c 226%2c 199%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M1400 103.48C1376.08 103.48 1353.33 117.76 1353.33 140C1353.33 172.54 1375.53 213.04 1400 213.04C1425.53 213.04 1453.33 171.95 1453.33 140C1453.33 117.17 1426.08 103.48 1400 103.48' stroke='rgba(209%2c 198%2c 198%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M840 224C825.89 224 826.67 254.05 826.67 280C826.67 288.14 831.74 292.17 840 292.17C864.66 292.17 892.5 294.06 892.5 280C892.5 259.97 858.81 224 840 224' stroke='rgba(167%2c 226%2c 199%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M79.51 0C79.51 33.64 22.04 107.33 0 107.33C-17.71 107.33 -22.84 30.83 0 0C16.92 -22.84 79.51 -20.02 79.51 0' stroke='rgba(209%2c 198%2c 198%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M146.36 140C156.15 91.02 214.51 72.41 280 72.41C336.8 72.41 343.19 98.84 390.94 140C413.19 159.18 404.09 193.1 420 193.1C436.96 193.1 431.93 159.47 456.67 140C501.93 104.37 504.35 96.61 560 82.89C626.01 66.61 641.22 103.99 700 80C742.77 62.54 723.21 22.8 763.1 0C793.21 -17.2 801.55 0 840 0C910 0 910 0 980 0C1029.67 0 1034.63 -12.38 1079.35 0C1104.63 7 1094.23 31.21 1120 38.77C1184.55 57.7 1199.82 66.35 1260 52.97C1287.01 46.97 1268.19 9.91 1294.39 0C1338.19 -16.57 1347.2 0 1400 0C1470 0 1505 -35 1540 0C1575 35 1540 70 1540 140C1540 210 1540 210 1540 280C1540 310.76 1559.27 341.52 1540 341.52C1495.83 341.52 1420.19 325.74 1413.13 280C1404.64 224.98 1512.58 200.34 1508.89 140C1506.02 93.05 1453.26 65.43 1400 65.43C1351.17 65.43 1307.35 94.25 1304.72 140C1301.18 201.53 1398.67 218.78 1387.65 280C1376.31 343.03 1325.05 388.5 1260 388.5C1191.23 388.5 1190 334.25 1120 280C1120 280 1120 280 1120 280C1057.93 210 1058.16 209.79 995.85 140C988.16 131.39 990.9 126.05 980 123.2C912.97 105.68 905.88 93.62 840 99.27C807.88 102.02 795.37 110.18 784 140C760.92 200.54 754.28 219.01 771.11 280C782.28 320.46 798.45 334.01 840 342.9C902.89 356.35 918.29 305.8 980 324.68C1044.29 344.35 1037.51 370.79 1092 420C1107.51 434 1106.98 434.74 1120 451.11C1162.68 504.74 1203.4 526.14 1203.4 560C1203.4 580.59 1161.7 560 1120 560C1050 560 1050 560 980 560C910 560 910 560 840 560C803.48 560 797.25 574.81 766.96 560C727.25 540.59 733.67 491.56 700 491.56C665.97 491.56 671.81 540.33 631.56 560C601.81 574.55 595.78 560 560 560C521.2 560 495.56 584.96 482.41 560C458.67 514.96 503.44 484.14 486.22 420C472.24 367.92 466.15 350.53 420 327.55C363.04 299.19 344.93 334.34 280 317.33C254.19 310.57 255.21 302.15 238.52 280C188.39 213.48 135.41 194.82 146.36 140' stroke='rgba(209%2c 198%2c 198%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M560 248.5C538.28 248.5 513.33 265.2 513.33 280C513.33 294.07 537.95 306.25 560 306.25C576.65 306.25 590.73 293.82 590.73 280C590.73 264.95 576.98 248.5 560 248.5' stroke='rgba(209%2c 198%2c 198%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M0 366.15C3.49 366.15 13.73 393.95 13.73 420C13.73 433.37 3.66 445 0 445C-3.21 445 0 432.5 0 420C0 393.08 -3.38 366.15 0 366.15' stroke='rgba(167%2c 226%2c 199%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M188.46 560C188.46 543.34 236.53 498.97 280 498.97C315.82 498.97 347.04 542.46 347.04 560C347.04 572.97 313.52 560 280 560C234.23 560 188.46 573.86 188.46 560' stroke='rgba(209%2c 198%2c 198%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M1331.89 560C1331.89 534.23 1354.71 492.2 1400 476C1458.77 454.98 1494.26 458.13 1540 485.57C1564.26 500.13 1564.3 547.08 1540 560C1494.3 584.3 1470 560 1400 560C1365.95 560 1331.89 576.23 1331.89 560' stroke='rgba(209%2c 198%2c 198%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M36.3 0C36.3 15.36 10.06 49 0 49C-8.09 49 -10.43 14.07 0 0C7.72 -10.43 36.3 -9.14 36.3 0' stroke='rgba(167%2c 226%2c 199%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M225.91 140C225.91 118.41 253.49 112.64 280 112.64C302.99 112.64 324.91 119.77 324.91 140C324.91 179.22 304.23 231.54 280 231.54C254.73 231.54 225.91 177.86 225.91 140' stroke='rgba(167%2c 226%2c 199%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M540 140C540 132.94 548.84 128.95 560 128.95C618.84 128.95 680 132.03 680 140C680 148.06 616.54 161 560 161C546.54 161 540 148.96 540 140' stroke='rgba(167%2c 226%2c 199%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M840 35.64C819.71 29.2 812.39 11.05 812.39 0C812.39 -6.77 826.19 0 840 0C910 0 910 0 980 0C1001.45 0 1022.9 -10.26 1022.9 0C1022.9 16.34 1009.84 47.39 980 53.2C918.39 65.21 903.51 55.8 840 35.64' stroke='rgba(167%2c 226%2c 199%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M1061.89 140C1061.89 113.96 1087 92.62 1120 92.62C1180.22 92.62 1193.2 107.56 1248.33 140C1263.2 148.75 1255.36 157.16 1260 175C1273.55 227.16 1284.71 231.56 1284.71 280C1284.71 294.56 1272.59 301 1260 301C1246.69 301 1247.06 289.65 1232.9 280C1177.06 241.92 1171.9 248.02 1120 205.53C1086.39 178.02 1061.89 170.42 1061.89 140' stroke='rgba(167%2c 226%2c 199%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M1400 27.39C1376.53 16.32 1355.79 7.4 1355.79 0C1355.79 -6.29 1377.89 0 1400 0C1470 0 1496.81 -26.81 1540 0C1566.81 16.64 1565.45 81.92 1540 86.9C1495.45 95.62 1468.64 59.77 1400 27.39' stroke='rgba(167%2c 226%2c 199%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M676.1 280C707.58 230.15 690.08 157.5 700 157.5C709.81 157.5 685.96 230.07 715.56 280C755.96 348.13 767.81 361.09 840 393.62C900.03 420.67 913.11 388.42 980 399.15C995.36 401.61 1004.5 407.08 1004.5 420C1004.5 442 992.94 444.86 980 469C955.41 514.86 967.09 535.53 929.44 560C897.09 581.03 884.72 560 840 560C822.5 560 818.23 570.14 805 560C748.23 516.48 752.79 452.67 700 452.67C646.63 452.67 650.27 515.84 592.67 560C580.27 569.5 576.34 560 560 560C542.29 560 527.25 574.11 524.58 560C514.01 504.11 520.36 487.13 533.51 420C538.07 396.71 542.77 396.09 560 379.17C614.06 326.09 637.58 340.99 676.1 280' stroke='rgba(209%2c 198%2c 198%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M1522.5 280C1522.5 264.44 1535.41 242.67 1540 242.67C1544.16 242.67 1540 261.34 1540 280C1540 284.24 1542.66 288.48 1540 288.48C1533.91 288.48 1522.5 287.34 1522.5 280' stroke='rgba(209%2c 198%2c 198%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M255.77 560C255.77 555.59 268.49 543.85 280 543.85C289.48 543.85 297.75 555.36 297.75 560C297.75 563.43 288.88 560 280 560C267.88 560 255.77 563.67 255.77 560' stroke='rgba(209%2c 198%2c 198%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M1093.75 560C1093.75 556.95 1108.36 548.33 1120 548.33C1125.96 548.33 1128.94 556.37 1128.94 560C1128.94 562.21 1124.47 560 1120 560C1106.88 560 1093.75 562.79 1093.75 560' stroke='rgba(209%2c 198%2c 198%2c 1)' stroke-width='2'%3e%3c/path%3e%3cpath d='M1440.83 560C1440.83 552.3 1501.58 529.87 1540 529.87C1551.17 529.87 1551.55 556.49 1540 560C1501.97 571.55 1440.83 567.37 1440.83 560' stroke='rgba(167%2c 226%2c 199%2c 1)' stroke-width='2'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1012'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
    } */
    button.onclick-btn-custom {
        box-shadow: none !important;
    }    

    ::v-deep(thead th) {
        background-color: #f3f2f7 !important;
        vertical-align: top;
        text-transform: uppercase;
        font-size: .857rem;
        letter-spacing: .5px;
    }

    .errImg {        
        width: 20%;
        display: block;
        margin: 0 auto;
    }

    .errMsg {
        display: block; 
        margin: 0 auto;
        width: 70%;
        padding: 15px;
        font-size: 12px;
    }


    @media (max-width: 420px) {
        .errImg {
            width: 50%;
        }

        .errMsg {
            width: 100%;
        }

    }

    @media (min-width:421px) and (max-width: 720px) {
        .errImg {
            width: 30%;
        }
        .errMsg {
            width: 100%;
        }
    }    
</style>