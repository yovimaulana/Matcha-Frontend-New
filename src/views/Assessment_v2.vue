<template>
    <div>
        <Toast />
        <div :class="'p-col-12 p-lg-12' ">
            <Breadcrumb class="custom-breadcrumb" :home="home" :model="items" />
        </div>
        <Skeleton v-if="kegiatanOptions == null" width="98%" height="3.3rem"
            style="margin-top: 10px; margin-left: 8px; border-radius: 0.357rem; background-color: #8080802b;" />
        <Card v-else class="custom-card-matcha ccm-custom">
            <template #content>
                <Dropdown v-model="selectedKegiatan" :options="kegiatanOptions.data" optionLabel="name" :filter="true"
                    placeholder="Pilih Kegiatan" :showClear="true" @change="getUserData(currentUser.id)"
                    style="width:100%; border: 0; padding: 10px">
                    <template #value="slotProps">
                        <div class="data-item data-item-value" v-if="slotProps.value">
                            <div>{{slotProps.value.name}}</div>
                        </div>
                        <span v-else>
                            {{slotProps.placeholder}}
                        </span>
                    </template>
                    <template #option="slotProps">
                        <div class="data-item">
                            <div>{{slotProps.option.name}}</div>
                        </div>
                    </template>
                </Dropdown>
            </template>
        </Card>

        <!-- frame ala ala -->
        <div class="p-grid p-jc-center">
            <iframe v-show="isIframeShow && !isFreshLoad" @load="loadIframe()"
                src="https://embed.lottiefiles.com/animation/107059" style="max-height:100%; overflow: auto;"
                class="p-mt-4" width="500" height="500" frameBorder="0"></iframe>
            <Skeleton v-if="!isIframeShow && isFreshLoad" width="500px" height="500px"
                style="margin-top: 37px; border-radius: 0.357rem; background-color: #8080802b;" />
        </div>

        <!-- Success Container -->

        <div v-if="this.successMessage !== null" style="text-align: center;">
            <br>
            <img src="../assets/matcha.png" class="hvr-bob mybob p-mt-1 " style="width: 30%; height: 18%;" alt=""
                srcset="">
            <br>
            <h1 style="color: dimgrey; font-variant: all-petite-caps; margin-bottom: 5px;">Selamat! Kamu sudah selesai Assessment!</h1>
            <h3 style="margin-top: 0; margin-bottom: 0;"> Ayo kerja lagi.</h3>
            <p style="font-style: italic; margin-top: 10px;">
                <span>So little time, so <span style="font-weight: 900;color:#78b34d"> MatchA </span> to do</span>
            </p>
        </div>

        <!-- Error Container -->

        <div v-if="this.errorMessages.length !== 0" style="text-align: center;">
            <br>
            <img src="../assets/matcha404.png" class="hvr-bob mybob p-mt-1 " style="width: 30%; height: 18%;" alt=""
                srcset="">
            <br>
            <h1 style="color: dimgrey; font-variant: all-petite-caps; margin-bottom: 5px;">Aww...Jangan Nangis.</h1>
            <h3 style="margin-top: 0; margin-bottom: 0;">Ini cuma error kecil! Ayo kerja lagi.</h3>
            <p style="font-style: italic; margin-top: 10px;">
                <span>So little time, so <span style="font-weight: 900;color:#78b34d"> MatchA </span> to do</span>
            </p>
        </div>
        <div v-if="this.errorMessages.length !== 0">
            <Message v-for="(error) in this.errorMessages" v-bind:key="error" severity="error">{{error}}</Message>
        </div>

        <!-- progres assessment user -->
        <Skeleton v-show="this.onLoadData" width="98%" height="250px"
            style="width: calc(100% - 30px); margin-top: 37px; border-radius: 0.357rem; background-color: #8080802b; margin-left: 10px;" />
        <div v-if="this.dataKegiatan !== null" class="p-col-12 p-lg-12" style="padding-right: 25px">
            <Card class="custom-card-matcha animate__animated animate__fadeIn"
                style="border-radius: 0.357rem; margin-top: 15px; padding: 15px">
                <template #title>
                    <div style="text-align: center; text-transform: uppercase;">Progress</div>
                </template>
                <template #content>
                    <div class="p-grid p-jc-center " style=" border-left-color: red; ">
                        <div class="p-col-12 p-lg-3 p-md-3 p-sm-3">
                            <div style="text-align: center">
                                <span style="font-size: 40px;"> {{dataKegiatan['summary']['belum_assessment']}}
                                </span> <br>
                                Belum Assessment
                            </div>
                        </div>
                        <div class="p-col-1">
                            <Divider layout="vertical" />
                        </div>
                        <div class="p-col-12 p-lg-3 p-md-3 p-sm-3">
                            <div style="text-align: center">
                                <span style="font-size: 40px;"> {{dataKegiatan['summary']['sudah_assessment']}}
                                </span> <br>
                                Sudah Assessment
                            </div>
                        </div>
                        <div class="p-col-1">
                            <Divider layout="vertical" />
                        </div>
                        <div class="p-col-12 p-lg-3 p-md-3 p-sm-3">
                            <div style="text-align: center">
                                <span style="font-size: 40px;"> {{
                                    dataKegiatan['summary']['total_data_assessment']}}
                                </span>
                                <br>
                                Total
                            </div>
                        </div>
                        <div class="p-col-12 p-mt-4">
                            <ProgressBar :value="Number(progresAssessment)">
                                <div style="color: white !important">{{progresAssessment}}%</div>
                            </ProgressBar>
                        </div>
                    </div>
                </template>
            </Card>
        </div>


        <div v-show="this.onLoadData" class="p-col-12 p-grid p-jc-between" style="padding-right:0">
            <Skeleton width="44%" height="50px"
                style="margin-top: 37px; border-radius: 0.357rem; background-color: #8080802b; margin-left: 10px;" />
            <Skeleton width="44%" height="50px"
                style="margin-top: 37px; border-radius: 0.357rem; background-color: #8080802b; margin-right: 10px;" />
        </div>
        <div v-if="this.dataAssessmentNonArray !== null" class="p-col-12 p-grid p-jc-between p-m-2 p-p-2"
            style="margin-left:10px !important; padding-right: 22px !important;">
            <Button style="font-weight: 900;border-radius: 0.357rem; width: 45%" label="Skip" icon="pi pi-forward"
            class="p-button-outlined p-button-danger p-jc-center p-ripple p-button-lg onclick-btn-custom" @click="skip()">
                <i class="pi pi-forward p-mr-2"></i> SKIP
            </Button>
            <Button icon="pi pi-send" iconPos="left" label="SUBMIT" style="font-weight:900;border-radius: 0.357rem; width:45%; background: #948bf4 !important; display: inline-block;"
                class="p-col-12 p-lg-6 p-jc-center p-ripple p-button-lg onclick-btn-custom submit-btn-matcha"
                @click="submit()" />
        </div>        
        <Skeleton v-show="this.onLoadData" width="98%" height="400px"
            style="margin-top: 30px; border-radius: 0.357rem; background-color: #8080802b; margin-left: 10px;" />
        <DataTable style="box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%); margin-left: 8px; margin-right: 8px"
            v-if="dataAssessmentNonArray !== null" :value="dataAssessmentNonArray"
            :class="myCardBgColorData+' '+myTextColorData" responsiveLayout="scroll" stripedRows :rowHover="true">
            <Column field="title" :class="myCardBgColorData+' '+myTextColorData" header="Variabel"
                headerStyle="width:10%;">
                <template #body="slotProps">
                    {{slotProps.data.title}}
                </template>
            </Column>

            <Column field="value" :class="myCardBgColorData+' '+myTextColorData" header="Data SBR"
                headerStyle="width:3em;">
                <template #body="slotProps">
                    <RadioButton
                        v-if="!['provinsi', 'kabupaten_kota', 'kecamatan', 'kelurahan_desa'].includes(slotProps.data.variable)"
                        v-model="selectedDataNonArray[slotProps.data.variable]" :id="'rb'+(slotProps.index)"
                        :name="slotProps.data.variable" :value="slotProps.data.value.sbr.value"
                        @change="onChangeValue(slotProps.data.variable, 'sbr')" />
                    <label :for="'rb'+(slotProps.index)" class="p-ml-2">
                        {{slotProps.data.value.sbr.value}}
                    </label>
                </template>
            </Column>

            <template v-for="i in dataAssessmentNonArray[0].value.assessment.length" :key="i">
                <Column :field="'sumber'+(i)" :class="myCardBgColorData+' '+myTextColorData"
                    :header="'Data Assessment - '+(i) " headerStyle="width:3em;">
                    <template #body="slotProps">
                        <RadioButton
                            v-if="!['provinsi', 'kabupaten_kota', 'kecamatan', 'kelurahan_desa'].includes(slotProps.data.variable)"
                            v-model="selectedDataNonArray[slotProps.data.variable]" :name="slotProps.data.variable"
                            :id="'rba'+(slotProps.index)+'-'+(i)" :value="slotProps.data.value.assessment[i-1]['value']"
                            @change="onChangeValue(slotProps.data.variable, 'assessment', i-1)" />
                        <label class="p-ml-2" :for="'rba' + (slotProps.index) + '-' + (i)">
                            {{slotProps.data.value.assessment[i-1]['value']}}
                        </label>
                    </template>
                </Column>
            </template>

            <Column :class="myCardBgColorData+' '+myTextColorData" header="Selected Value" headerStyle="width:3em;">
                <template #body="slotProps">
                    <div>
                        <p style="background-color: lightgrey; padding:5px">{{
                        selectedDataNonArray[slotProps.data.variable]
                        }}</p>
                        <Button icon="pi pi-pencil" class="p-button-warning p-button-sm p-button-raised" label="Edit"
                            @click="editValueSelected(slotProps.data.variable)" />
                    </div>
                </template>
            </Column>

        </DataTable>

        <!-- Aktivitas -->
        
        <div v-show="this.onLoadData" class="p-grid" style="padding-left: 7px;">
            <div class="p-col-3">
                <Skeleton height="150px"
                    style="margin-top: 30px; border-radius: 0.357rem; background-color: #8080802b;" />
            </div>
            <div class="p-col-9">
                <Skeleton width="97%" height="150px"
                    style="margin-top: 30px; border-radius: 0.357rem; background-color: #8080802b; margin-left: 10px;" />
            </div>
        </div>
        <div v-if="this.dataKegiatan !== null" class="p-grid" style="padding-left:7px">
            <div class="p-col-3" style="margin-top: 11px;">
                <TreeTable v-if="tempDataAssessmentAktivitas != null"
                    :value="tempDataAssessmentAktivitas">
                    <Column field="name" header="Data Assessment" :expander="true"></Column>
                    <Column field="value" header="Value"></Column>
                    <Column header="Action">
                        <template #body="slotProps">
                            <Button @click="addAktivitasToSBR(slotProps)" v-if="slotProps.node.data.type == 'button'"
                                icon="pi pi-plus" class="p-button-primary p-button-sm p-button-raised" label=""
                                title="Add to SBR" />
                        </template>
                    </Column>
                </TreeTable>
            </div>
            <div class="p-col-9">
                <DataTable v-if="dataAssessmentAktivitas != null" :rowClass="rowClass" rowGroupMode="rowspan"
                    groupRowsBy="dataAssessmentAktivitas.status"
                    style="box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%); margin-left: 8px; margin-right: 8px; margin-top: 10px"
                    :value="dataAssessmentAktivitas" :class="myCardBgColorData+' '+myTextColorData"
                    responsiveLayout="scroll">
                    <template #header>
                        <div class="p-grid">
                            <div class="table-header-tmp p-col-9">
                                KEGIATAN / AKTIVITAS PERUSAHAAN
                            </div>
                            <div class="p-col-3" style="text-align: right">
                                <Button @click="addNew('aktivitas')" label="Add New" icon="pi pi-plus" />
                            </div>
                        </div>
                        
                    </template>
                    <Column header="#" headerStyle="width:3em">
                        <template #body="slotProps">
                            {{slotProps.index + 1}}
                        </template>
                    </Column>
                    <!-- <Column field="status" header="Status">
                        <template #body="slotProps">
                            <span>{{slotProps.data.status}}</span>
                        </template>
                    </Column> -->
                    <Column field="sumber" :class="myCardBgColorData+' '+myTextColorData" header="Sumber Data">
                    </Column>
                    <Column field="aktivitas" :class="myCardBgColorData+' '+myTextColorData" header="Aktivitas">
                    </Column>
                    <Column field="jenis" :class="myCardBgColorData+' '+myTextColorData" header="Jenis"></Column>
                    <Column field="kategori" :class="myCardBgColorData+' '+myTextColorData" header="Kategori">
                    </Column>
                    <Column field="kbli" :class="myCardBgColorData+' '+myTextColorData" header="KBLI"></Column>
                    <Column :class="myCardBgColorData+' '+myTextColorData" header="Action">
                        <template #body="slotProps">
                            <Button
                                @click="dataAssessmentAktivitas[slotProps.index]['tpsumber'] = 'sbr'; dataAssessmentAktivitas[slotProps.index]['status'] = 'SAVED' "
                                v-if="slotProps.data.tpsumber == 'assessment'" icon="pi pi-plus"
                                class="p-button-primary p-button-sm p-button-raised" label="" title="Add to SBR" />
                            <Button @click="openDialogAktivitas(slotProps)" v-if="slotProps.data.tpsumber == 'sbr'"
                                icon="pi pi-pencil" class="p-button-warning p-button-sm p-button-raised" label=""
                                title="Edit SBR" />
                            <br />
                            <Button @click="removeAktivitasFromSBR(slotProps.index)" style="margin-top: 5px"
                                v-if="slotProps.data.tpsumber == 'sbr' && slotProps.data.orisumber == 'assessment'"
                                icon="pi pi-undo" class="p-button-danger p-button-sm p-button-raised" label=""
                                title="Batal Tambah SBR" />

                            <Button @click="removeAktivitasFromSBR(slotProps.index)" style="margin-top: 5px"
                                v-if="slotProps.data.tpsumber == 'sbr' && slotProps.data.orisumber == 'assessment-new'"
                                icon="pi pi-trash" class="p-button-danger p-button-sm p-button-raised" label=""
                                title="Batal Tambah SBR" />
                        </template>
                    </Column>
                    <template #footer>
                        Total data aktivitas yang akan disimpan: {{dataAssessmentAktivitas.filter(el => el.tpsumber ==
                'sbr').length}}
                    </template>
                </DataTable>
            </div>
        </div>

        <!-- Produk -->
        <div v-show="this.onLoadData" class="p-grid" style="padding-left: 7px;">
            <div class="p-col-3">
                <Skeleton height="150px"
                    style="margin-top: 30px; border-radius: 0.357rem; background-color: #8080802b;" />
            </div>
            <div class="p-col-9">
                <Skeleton width="97%" height="150px"
                    style="margin-top: 30px; border-radius: 0.357rem; background-color: #8080802b; margin-left: 10px;" />
            </div>
        </div>
        <div v-if="this.dataKegiatan !== null" class="p-grid" style="padding-left:7px">
            <div class="p-col-3" style="margin-top: 11px;">
                <TreeTable v-if="tempDataAssessmentProduk != null"
                    :value="tempDataAssessmentProduk">
                    <Column field="name" header="Data Assessment" :expander="true"></Column>
                    <Column field="value" header="Value"></Column>
                    <Column header="Action">
                        <template #body="slotProps">
                            <Button @click="addProdukToSBR(slotProps)" v-if="slotProps.node.data.type == 'button'"
                                icon="pi pi-plus" class="p-button-primary p-button-sm p-button-raised" label=""
                                title="Add to SBR" />
                        </template>
                    </Column>
                </TreeTable>
            </div>
            <div class="p-col-9">
                <DataTable v-if="dataAssessmentProduk != null" :rowClass="rowClass" rowGroupMode="rowspan"
                    groupRowsBy="dataAssessmentProduk.status"
                    style="box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%); margin-left: 8px; margin-right: 8px; margin-top: 10px"
                    :value="dataAssessmentProduk" :class="myCardBgColorData+' '+myTextColorData"
                    responsiveLayout="scroll">
                    <template #header>
                        <div class="table-header-tmp">
                            PRODUK PERUSAHAAN
                        </div>
                    </template>
                    <Column header="#" headerStyle="width:3em">
                        <template #body="slotProps">
                            {{slotProps.index + 1}}
                        </template>
                    </Column>
                    <!-- <Column field="status" header="Status">
                        <template #body="slotProps">
                            <span>{{slotProps.data.status}}</span>
                        </template>
                    </Column> -->
                    <Column field="sumber" :class="myCardBgColorData+' '+myTextColorData" header="Sumber Data">
                    </Column>
                    <Column field="produk" :class="myCardBgColorData+' '+myTextColorData" header="Produk">
                    </Column>
                    <Column field="kbki" :class="myCardBgColorData+' '+myTextColorData" header="KBKI"></Column>
                    <Column :class="myCardBgColorData+' '+myTextColorData" header="Action">
                        <template #body="slotProps">
                            <Button
                                @click="dataAssessmentProduk[slotProps.index]['tpsumber'] = 'sbr'; dataAssessmentProduk[slotProps.index]['status'] = 'SAVED' "
                                v-if="slotProps.data.tpsumber == 'assessment'" icon="pi pi-plus"
                                class="p-button-primary p-button-sm p-button-raised" label="" title="Add to SBR" />
                            <Button @click="openDialogProduk(slotProps)" v-if="slotProps.data.tpsumber == 'sbr'"
                                icon="pi pi-pencil" class="p-button-warning p-button-sm p-button-raised" label=""
                                title="Edit SBR" />
                            <br />
                            <Button @click="removeProdukFromSBR(slotProps.index)" style="margin-top: 5px"
                                v-if="slotProps.data.tpsumber == 'sbr' && slotProps.data.orisumber == 'assessment'"
                                icon="pi pi-undo" class="p-button-danger p-button-sm p-button-raised" label=""
                                title="Batal Tambah SBR" />
                        </template>
                    </Column>
                    <template #footer>
                        Total data produk yang akan disimpan: {{dataAssessmentProduk.filter(el => el.tpsumber ==
                'sbr').length}}
                    </template>
                </DataTable>
            </div>
        </div>

        <!-- Saham -->
        <div v-show="this.onLoadData" class="p-grid" style="padding-left: 7px;">
            <div class="p-col-3">
                <Skeleton height="150px"
                    style="margin-top: 30px; border-radius: 0.357rem; background-color: #8080802b;" />
            </div>
            <div class="p-col-9">
                <Skeleton width="97%" height="150px"
                    style="margin-top: 30px; border-radius: 0.357rem; background-color: #8080802b; margin-left: 10px;" />
            </div>
        </div>
        <div v-if="this.dataKegiatan !== null" class="p-grid" style="padding-left:7px">
            <div class="p-col-3" style="margin-top: 11px;">
                <TreeTable v-if="tempDataAssessmentSaham != null"
                    :value="tempDataAssessmentSaham">
                    <Column field="name" header="Data Assessment" :expander="true"></Column>
                    <Column field="value" header="Value"></Column>
                    <Column header="Action">
                        <template #body="slotProps">
                            <Button @click="addSahamToSBR(slotProps)" v-if="slotProps.node.data.type == 'button'"
                                icon="pi pi-plus" class="p-button-primary p-button-sm p-button-raised" label=""
                                title="Add to SBR" />
                        </template>
                    </Column>
                </TreeTable>
            </div>
            <div class="p-col-9">
                <DataTable v-if="dataAssessmentSaham != null" :rowClass="rowClass" rowGroupMode="rowspan"
                    groupRowsBy="dataAssessmentSaham.status"
                    style="box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%); margin-left: 8px; margin-right: 8px; margin-top: 10px"
                    :value="dataAssessmentSaham" :class="myCardBgColorData+' '+myTextColorData"
                    responsiveLayout="scroll">
                    <template #header>
                        <div class="table-header-tmp">
                            SAHAM PERUSAHAAN
                        </div>
                    </template>
                    <Column header="#" headerStyle="width:3em">
                        <template #body="slotProps">
                            {{slotProps.index + 1}}
                        </template>
                    </Column>
                    <!-- <Column field="status" header="Status">
                        <template #body="slotProps">
                            <span>{{slotProps.data.status}}</span>
                        </template>
                    </Column> -->
                    <Column field="sumber" :class="myCardBgColorData+' '+myTextColorData" header="Sumber Data">
                    </Column>
                    <Column field="pemegang_saham" :class="myCardBgColorData+' '+myTextColorData"
                        header="Pemegang Saham">
                    </Column>
                    <Column field="persentase_saham" :class="myCardBgColorData+' '+myTextColorData"
                        header="Persentase Saham"></Column>
                    <Column :class="myCardBgColorData+' '+myTextColorData" header="Action">
                        <template #body="slotProps">
                            <Button
                                @click="dataAssessmentSaham[slotProps.index]['tpsumber'] = 'sbr'; dataAssessmentSaham[slotProps.index]['status'] = 'SAVED' "
                                v-if="slotProps.data.tpsumber == 'assessment'" icon="pi pi-plus"
                                class="p-button-primary p-button-sm p-button-raised" label="" title="Add to SBR" />
                            <Button @click="openDialogSaham(slotProps)" v-if="slotProps.data.tpsumber == 'sbr'"
                                icon="pi pi-pencil" class="p-button-warning p-button-sm p-button-raised" label=""
                                title="Edit SBR" />
                            <br />
                            <Button @click="removeSahamFromSBR(slotProps.index)" style="margin-top: 5px"
                                v-if="slotProps.data.tpsumber == 'sbr' && slotProps.data.orisumber == 'assessment'"
                                icon="pi pi-undo" class="p-button-danger p-button-sm p-button-raised" label=""
                                title="Batal Tambah SBR" />
                        </template>
                    </Column>
                    <template #footer>
                        Total data saham yang akan disimpan: {{dataAssessmentSaham.filter(el => el.tpsumber ==
                'sbr').length}}
                    </template>
                </DataTable>
            </div>
        </div>

        <!-- Email -->
        <div v-show="this.onLoadData" class="p-grid" style="padding-left: 7px;">
            <div class="p-col-3">
                <Skeleton height="150px"
                    style="margin-top: 30px; border-radius: 0.357rem; background-color: #8080802b;" />
            </div>
            <div class="p-col-9">
                <Skeleton width="97%" height="150px"
                    style="margin-top: 30px; border-radius: 0.357rem; background-color: #8080802b; margin-left: 10px;" />
            </div>
        </div>
        <div v-if="this.dataKegiatan !== null" class="p-grid" style="padding-left:7px">
            <div class="p-col-3" style="margin-top: 11px;">
                <TreeTable v-if="tempDataAssessmentEmail != null"
                    :value="tempDataAssessmentEmail">
                    <Column field="name" header="Data Assessment" :expander="true"></Column>
                    <Column field="value" header="Value"></Column>
                    <Column header="Action">
                        <template #body="slotProps">
                            <Button @click="addEmailToSBR(slotProps)" v-if="slotProps.node.data.type == 'button'"
                                icon="pi pi-plus" class="p-button-primary p-button-sm p-button-raised" label=""
                                title="Add to SBR" />
                        </template>
                    </Column>
                </TreeTable>
            </div>
            <div class="p-col-9">
                <DataTable v-if="dataAssessmentEmail != null" :rowClass="rowClass" rowGroupMode="rowspan"
                    groupRowsBy="dataAssessmentEmail.status"
                    style="box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%); margin-left: 8px; margin-right: 8px; margin-top: 10px"
                    :value="dataAssessmentEmail" :class="myCardBgColorData+' '+myTextColorData"
                    responsiveLayout="scroll">
                    <template #header>
                        <div class="table-header-tmp">
                            EMAIL PERUSAHAAN
                        </div>
                    </template>
                    <Column header="#" headerStyle="width:3em">
                        <template #body="slotProps">
                            {{slotProps.index + 1}}
                        </template>
                    </Column>
                    <!-- <Column field="status" header="Status">
                        <template #body="slotProps">
                            <span>{{slotProps.data.status}}</span>
                        </template>
                    </Column> -->
                    <Column field="sumber" :class="myCardBgColorData+' '+myTextColorData" header="Sumber Data">
                    </Column>
                    <Column field="email" :class="myCardBgColorData+' '+myTextColorData" header="Email">
                    </Column>
                    <Column :class="myCardBgColorData+' '+myTextColorData" header="Action">
                        <template #body="slotProps">
                            <Button
                                @click="dataAssessmentEmail[slotProps.index]['tpsumber'] = 'sbr'; dataAssessmentEmail[slotProps.index]['status'] = 'SAVED' "
                                v-if="slotProps.data.tpsumber == 'assessment'" icon="pi pi-plus"
                                class="p-button-primary p-button-sm p-button-raised" label="" title="Add to SBR" />
                            <Button @click="openDialogEmail(slotProps)" v-if="slotProps.data.tpsumber == 'sbr'"
                                icon="pi pi-pencil" class="p-button-warning p-button-sm p-button-raised" label=""
                                title="Edit SBR" />
                            <br />
                            <Button @click="removeEmailFromSBR(slotProps.index)" style="margin-top: 5px"
                                v-if="slotProps.data.tpsumber == 'sbr' && slotProps.data.orisumber == 'assessment'"
                                icon="pi pi-undo" class="p-button-danger p-button-sm p-button-raised" label=""
                                title="Batal Tambah SBR" />
                        </template>
                    </Column>
                    <template #footer>
                        Total data email yang akan disimpan: {{dataAssessmentEmail.filter(el => el.tpsumber ==
                'sbr').length}}
                    </template>
                </DataTable>
            </div>
        </div>

        <!-- Fax -->
        <div v-show="this.onLoadData" class="p-grid" style="padding-left: 7px;">
            <div class="p-col-3">
                <Skeleton height="150px"
                    style="margin-top: 30px; border-radius: 0.357rem; background-color: #8080802b;" />
            </div>
            <div class="p-col-9">
                <Skeleton width="97%" height="150px"
                    style="margin-top: 30px; border-radius: 0.357rem; background-color: #8080802b; margin-left: 10px;" />
            </div>
        </div>
        <div v-if="this.dataKegiatan !== null" class="p-grid" style="padding-left:7px">
            <div class="p-col-3" style="margin-top: 11px;">
                <TreeTable v-if="tempDataAssessmentFax != null"
                    :value="tempDataAssessmentFax">
                    <Column field="name" header="Data Assessment" :expander="true"></Column>
                    <Column field="value" header="Value"></Column>
                    <Column header="Action">
                        <template #body="slotProps">
                            <Button @click="addFaxToSBR(slotProps)" v-if="slotProps.node.data.type == 'button'"
                                icon="pi pi-plus" class="p-button-primary p-button-sm p-button-raised" label=""
                                title="Add to SBR" />
                        </template>
                    </Column>
                </TreeTable>
            </div>
            <div class="p-col-9">
                <DataTable v-if="dataAssessmentFax != null" :rowClass="rowClass" rowGroupMode="rowspan"
                    groupRowsBy="dataAssessmentFax.status"
                    style="box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%); margin-left: 8px; margin-right: 8px; margin-top: 10px"
                    :value="dataAssessmentFax" :class="myCardBgColorData+' '+myTextColorData" responsiveLayout="scroll">
                    <template #header>
                        <div class="table-header-tmp">
                            FAX PERUSAHAAN
                        </div>
                    </template>
                    <Column header="#" headerStyle="width:3em">
                        <template #body="slotProps">
                            {{slotProps.index + 1}}
                        </template>
                    </Column>
                    <!-- <Column field="status" header="Status">
                        <template #body="slotProps">
                            <span>{{slotProps.data.status}}</span>
                        </template>
                    </Column> -->
                    <Column field="sumber" :class="myCardBgColorData+' '+myTextColorData" header="Sumber Data">
                    </Column>
                    <Column field="nomor_faksimili" :class="myCardBgColorData+' '+myTextColorData" header="Fax">
                    </Column>
                    <Column :class="myCardBgColorData+' '+myTextColorData" header="Action">
                        <template #body="slotProps">
                            <Button
                                @click="dataAssessmentFax[slotProps.index]['tpsumber'] = 'sbr'; dataAssessmentFax[slotProps.index]['status'] = 'SAVED' "
                                v-if="slotProps.data.tpsumber == 'assessment'" icon="pi pi-plus"
                                class="p-button-primary p-button-sm p-button-raised" label="" title="Add to SBR" />
                            <Button @click="openDialogFax(slotProps)" v-if="slotProps.data.tpsumber == 'sbr'"
                                icon="pi pi-pencil" class="p-button-warning p-button-sm p-button-raised" label=""
                                title="Edit SBR" />
                            <br />
                            <Button @click="removeFaxFromSBR(slotProps.index)" style="margin-top: 5px"
                                v-if="slotProps.data.tpsumber == 'sbr' && slotProps.data.orisumber == 'assessment'"
                                icon="pi pi-undo" class="p-button-danger p-button-sm p-button-raised" label=""
                                title="Batal Tambah SBR" />
                        </template>
                    </Column>
                    <template #footer>
                        Total data fax yang akan disimpan: {{dataAssessmentFax.filter(el => el.tpsumber ==
                'sbr').length}}
                    </template>
                </DataTable>
            </div>
        </div>

        <!-- Telepon -->
        <div v-show="this.onLoadData" class="p-grid" style="padding-left: 7px;">
            <div class="p-col-3">
                <Skeleton height="150px"
                    style="margin-top: 30px; border-radius: 0.357rem; background-color: #8080802b;" />
            </div>
            <div class="p-col-9">
                <Skeleton width="97%" height="150px"
                    style="margin-top: 30px; border-radius: 0.357rem; background-color: #8080802b; margin-left: 10px;" />
            </div>
        </div>
        <div v-if="this.dataKegiatan !== null" class="p-grid" style="padding-left:7px">
            <div class="p-col-3" style="margin-top: 11px;">
                <TreeTable v-if="tempDataAssessmentTelepon != null"
                    :value="tempDataAssessmentTelepon">
                    <Column field="name" header="Data Assessment" :expander="true"></Column>
                    <Column field="value" header="Value"></Column>
                    <Column header="Action">
                        <template #body="slotProps">
                            <Button @click="addTeleponToSBR(slotProps)" v-if="slotProps.node.data.type == 'button'"
                                icon="pi pi-plus" class="p-button-primary p-button-sm p-button-raised" label=""
                                title="Add to SBR" />
                        </template>
                    </Column>
                </TreeTable>
            </div>
            <div class="p-col-9">
                <DataTable v-if="dataAssessmentTelepon != null" :rowClass="rowClass" rowGroupMode="rowspan"
                    groupRowsBy="dataAssessmentTelepon.status"
                    style="box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%); margin-left: 8px; margin-right: 8px; margin-top: 10px"
                    :value="dataAssessmentTelepon" :class="myCardBgColorData+' '+myTextColorData"
                    responsiveLayout="scroll">
                    <template #header>
                        <div class="table-header-tmp">
                            TELEPON PERUSAHAAN
                        </div>
                    </template>
                    <Column header="#" headerStyle="width:3em">
                        <template #body="slotProps">
                            {{slotProps.index + 1}}
                        </template>
                    </Column>                    
                    <Column field="sumber" :class="myCardBgColorData+' '+myTextColorData" header="Sumber Data">
                    </Column>
                    <Column field="nomor_ekstensi" :class="myCardBgColorData+' '+myTextColorData" header="No Ekstensi">
                    </Column>
                    <Column field="nomor_telepon" :class="myCardBgColorData+' '+myTextColorData" header="No Telepon">
                    </Column>
                    <Column :class="myCardBgColorData+' '+myTextColorData" header="Action">
                        <template #body="slotProps">
                            <Button
                                @click="dataAssessmentTelepon[slotProps.index]['tpsumber'] = 'sbr'; dataAssessmentTelepon[slotProps.index]['status'] = 'SAVED' "
                                v-if="slotProps.data.tpsumber == 'assessment'" icon="pi pi-plus"
                                class="p-button-primary p-button-sm p-button-raised" label="" title="Add to SBR" />
                            <Button @click="openDialogTelepon(slotProps)" v-if="slotProps.data.tpsumber == 'sbr'"
                                icon="pi pi-pencil" class="p-button-warning p-button-sm p-button-raised" label=""
                                title="Edit SBR" />
                            <br />
                            <Button @click="removeTeleponFromSBR(slotProps.index)" style="margin-top: 5px"
                                v-if="slotProps.data.tpsumber == 'sbr' && slotProps.data.orisumber == 'assessment'"
                                icon="pi pi-undo" class="p-button-danger p-button-sm p-button-raised" label=""
                                title="Batal Tambah SBR" />
                        </template>
                    </Column>
                    <template #footer>
                        Total data fax yang akan disimpan: {{dataAssessmentTelepon.filter(el => el.tpsumber ==
                'sbr').length}}
                    </template>
                </DataTable>
            </div>
        </div>

        <!-- Website -->
        <div v-show="this.onLoadData" class="p-grid" style="padding-left: 7px;">
            <div class="p-col-3">
                <Skeleton height="150px"
                    style="margin-top: 30px; border-radius: 0.357rem; background-color: #8080802b;" />
            </div>
            <div class="p-col-9">
                <Skeleton width="97%" height="150px"
                    style="margin-top: 30px; border-radius: 0.357rem; background-color: #8080802b; margin-left: 10px;" />
            </div>
        </div>
        <div v-if="this.dataKegiatan !== null" class="p-grid" style="padding-left:7px">
            <div class="p-col-3" style="margin-top: 11px;">
                <TreeTable v-if="tempDataAssessmentWeb != null"
                    :value="tempDataAssessmentWeb">
                    <Column field="name" header="Data Assessment" :expander="true"></Column>
                    <Column field="value" header="Value"></Column>
                    <Column header="Action">
                        <template #body="slotProps">
                            <Button @click="addWebToSBR(slotProps)" v-if="slotProps.node.data.type == 'button'"
                                icon="pi pi-plus" class="p-button-primary p-button-sm p-button-raised" label=""
                                title="Add to SBR" />
                        </template>
                    </Column>
                </TreeTable>
            </div>
            <div class="p-col-9">
                <DataTable v-if="dataAssessmentWeb != null" :rowClass="rowClass" rowGroupMode="rowspan"
                    groupRowsBy="dataAssessmentWeb.status"
                    style="box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%); margin-left: 8px; margin-right: 8px; margin-top: 10px"
                    :value="dataAssessmentWeb" :class="myCardBgColorData+' '+myTextColorData" responsiveLayout="scroll">
                    <template #header>
                        <div class="table-header-tmp">
                            WEBSITE PERUSAHAAN
                        </div>
                    </template>
                    <Column header="#" headerStyle="width:3em">
                        <template #body="slotProps">
                            {{slotProps.index + 1}}
                        </template>
                    </Column>
                    <!-- <Column field="status" header="Status">
                        <template #body="slotProps">
                            <span>{{slotProps.data.status}}</span>
                        </template>
                    </Column> -->
                    <Column field="sumber" :class="myCardBgColorData+' '+myTextColorData" header="Sumber Data">
                    </Column>
                    <Column field="website" :class="myCardBgColorData+' '+myTextColorData" header="Website">
                    </Column>
                    <Column :class="myCardBgColorData+' '+myTextColorData" header="Action">
                        <template #body="slotProps">
                            <Button
                                @click="dataAssessmentWeb[slotProps.index]['tpsumber'] = 'sbr'; dataAssessmentWeb[slotProps.index]['status'] = 'SAVED' "
                                v-if="slotProps.data.tpsumber == 'assessment'" icon="pi pi-plus"
                                class="p-button-primary p-button-sm p-button-raised" label="" title="Add to SBR" />
                            <Button @click="openDialogWeb(slotProps)" v-if="slotProps.data.tpsumber == 'sbr'"
                                icon="pi pi-pencil" class="p-button-warning p-button-sm p-button-raised" label=""
                                title="Edit SBR" />
                            <br />
                            <Button @click="removeWebFromSBR(slotProps.index)" style="margin-top: 5px"
                                v-if="slotProps.data.tpsumber == 'sbr' && slotProps.data.orisumber == 'assessment'"
                                icon="pi pi-undo" class="p-button-danger p-button-sm p-button-raised" label=""
                                title="Batal Tambah SBR" />
                        </template>
                    </Column>
                    <template #footer>
                        Total data website yang akan disimpan: {{dataAssessmentWeb.filter(el => el.tpsumber ==
                'sbr').length}}
                    </template>
                </DataTable>
            </div>
        </div>

        <!-- CP -->
        <div v-show="this.onLoadData" class="p-grid" style="padding-left: 7px;">
            <div class="p-col-3">
                <Skeleton height="150px"
                    style="margin-top: 30px; border-radius: 0.357rem; background-color: #8080802b;" />
            </div>
            <div class="p-col-9">
                <Skeleton width="97%" height="150px"
                    style="margin-top: 30px; border-radius: 0.357rem; background-color: #8080802b; margin-left: 10px;" />
            </div>
        </div>
        <div v-if="this.dataKegiatan !== null" class="p-grid" style="padding-left:7px">
            <div class="p-col-3" style="margin-top: 11px;">
                <TreeTable v-if="tempDataAssessmentKontak != null"
                    :value="tempDataAssessmentKontak">
                    <Column field="name" header="Data Assessment" :expander="true"></Column>
                    <Column field="value" header="Value"></Column>
                    <Column header="Action">
                        <template #body="slotProps">
                            <Button @click="addKontakToSBR(slotProps)" v-if="slotProps.node.data.type == 'button'"
                                icon="pi pi-plus" class="p-button-primary p-button-sm p-button-raised" label=""
                                title="Add to SBR" />
                        </template>
                    </Column>
                </TreeTable>
            </div>
            <div class="p-col-9">
                <DataTable v-if="dataAssessmentKontak != null" :rowClass="rowClass" rowGroupMode="rowspan"
                    groupRowsBy="dataAssessmentKontak.status"
                    style="box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%); margin-left: 8px; margin-right: 8px; margin-top: 10px"
                    :value="dataAssessmentKontak" :class="myCardBgColorData+' '+myTextColorData"
                    responsiveLayout="scroll">
                    <template #header>
                        <div class="table-header-tmp">
                            Contact Person PERUSAHAAN
                        </div>
                    </template>
                    <Column header="#" headerStyle="width:3em">
                        <template #body="slotProps">
                            {{slotProps.index + 1}}
                        </template>
                    </Column>
                    <!-- <Column field="status" header="Status">
                        <template #body="slotProps">
                            <span>{{slotProps.data.status}}</span>
                        </template>
                    </Column> -->
                    <Column field="sumber" :class="myCardBgColorData+' '+myTextColorData" header="Sumber Data">
                    </Column>
                    <Column field="nama" :class="myCardBgColorData+' '+myTextColorData" header="Nama CP">
                    </Column>
                    <Column field="email" :class="myCardBgColorData+' '+myTextColorData" header="Email CP">
                    </Column>
                    <Column field="nomor_telepon" :class="myCardBgColorData+' '+myTextColorData" header="No Telp CP">
                    </Column>
                    <Column :class="myCardBgColorData+' '+myTextColorData" header="Action">
                        <template #body="slotProps">
                            <Button
                                @click="dataAssessmentKontak[slotProps.index]['tpsumber'] = 'sbr'; dataAssessmentKontak[slotProps.index]['status'] = 'SAVED' "
                                v-if="slotProps.data.tpsumber == 'assessment'" icon="pi pi-plus"
                                class="p-button-primary p-button-sm p-button-raised" label="" title="Add to SBR" />
                            <Button @click="openDialogKontak(slotProps)" v-if="slotProps.data.tpsumber == 'sbr'"
                                icon="pi pi-pencil" class="p-button-warning p-button-sm p-button-raised" label=""
                                title="Edit SBR" />
                            <br />
                            <Button @click="removeKontakFromSBR(slotProps.index)" style="margin-top: 5px"
                                v-if="slotProps.data.tpsumber == 'sbr' && slotProps.data.orisumber == 'assessment'"
                                icon="pi pi-undo" class="p-button-danger p-button-sm p-button-raised" label=""
                                title="Batal Tambah SBR" />
                        </template>
                    </Column>
                    <template #footer>
                        Total data cp perusahaan yang akan disimpan: {{dataAssessmentKontak.filter(el => el.tpsumber ==
                'sbr').length}}
                    </template>
                </DataTable>
            </div>
        </div>    


        <Toast />

        <Loading v-model:active="loadingDialog" :is-full-page="true" :color="'#86d166'" :background-color="'black'"
            :opacity="0.75">
            <slot>
                <MyLoading></MyLoading>
            </slot>
        </Loading>

        <!-- dialog aktivitas perusahaan -->
        <Dialog :header="'Edit Aktivitas'" v-model:visible="displayDialogAktivitas" :style="{width: '50vw'}">
            <div class="field">
                <label style="margin-bottom: 0.5rem; color: darkgrey; font-size: smaller"
                    for="act_aktivitas">Aktivitas</label>
                <InputText style="width:100%" id="act_aktivitas" v-model.trim="dataEditedAktivitas['aktivitas']" />
            </div>
            <div class="field" style="margin-top:10px">
                <label style="margin-bottom: 0.5rem; color: darkgrey; font-size: smaller" for="act_jenis">Jenis</label>
                <Dropdown id="act_jenis" style="width: 100%" :options="optionJenisAktivitas" optionLabel="nama"
                    optionValue="nama" placeholder="" :filter="true" v-model="dataEditedAktivitas['jenis']" />
            </div>
            <div class="field" style="margin-top:10px">
                <label style="margin-bottom: 0.5rem; color: darkgrey; font-size: smaller"
                    for="act_kategori">Kategori</label>
                <InputText style="width:100%" id="act_kategori" v-model.trim="dataEditedAktivitas['kategori']" />
            </div>
            <div class="field" style="margin-top:10px">
                <label style="margin-bottom: 0.5rem; color: darkgrey; font-size: smaller" for="act_kbli">KBLI</label>
                <InputText style="width:100%" id="act_kbli" v-model.trim="dataEditedAktivitas['kbli']" />
            </div>

            <template #footer>
                <Button label="No" icon="pi pi-times" @click="displayDialogAktivitas=false" class="p-button-text" />
                <Button label="Save" icon="pi pi-check" @click="saveEditedAktivitas()" />
            </template>
        </Dialog>

        <!-- dialog produk perusahaan -->
        <Dialog :header="'Edit Produk'" v-model:visible="displayDialogProduk" :style="{width: '50vw'}">
            <div class="field">
                <label style="margin-bottom: 0.5rem; color: darkgrey; font-size: smaller"
                    for="act_produk">Produk</label>
                <InputText style="width:100%" id="act_produk" v-model.trim="dataEditedProduk['produk']" />
            </div>
            <div class="field" style="margin-top:10px">
                <label style="margin-bottom: 0.5rem; color: darkgrey; font-size: smaller" for="act_kbki">KBKI</label>
                <InputText style="width:100%" id="act_kbki" v-model.trim="dataEditedProduk['kbki']" />
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="displayDialogProduk=false" class="p-button-text" />
                <Button label="Save" icon="pi pi-check" @click="saveEditedProduk()" />
            </template>
        </Dialog>

        <!-- dialog saham perusahaan -->
        <Dialog :header="'Edit Saham'" v-model:visible="displayDialogSaham" :style="{width: '50vw'}">
            <div class="field">
                <label style="margin-bottom: 0.5rem; color: darkgrey; font-size: smaller"
                    for="act_pemegang_saham">Pemegang Saham</label>
                <InputText style="width:100%" id="act_pemegang_saham"
                    v-model.trim="dataEditedSaham['pemegang_saham']" />
            </div>
            <div class="field" style="margin-top:10px">
                <label style="margin-bottom: 0.5rem; color: darkgrey; font-size: smaller"
                    for="act_persentase_saham">Persentase Saham</label>
                <InputNumber style="width:100%" id="act_persentase_saham" v-model="dataEditedSaham['persentase_saham']"
                    suffix="%" mode="decimal" :minFractionDigits="2" :maxFractionDigits="2" :max="100" />
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="displayDialogSaham=false" class="p-button-text" />
                <Button label="Save" icon="pi pi-check" @click="saveEditedSaham()" />
            </template>
        </Dialog>

        <!-- dialog email perusahaan -->
        <Dialog :header="'Edit Email'" v-model:visible="displayDialogEmail" :style="{width: '50vw'}">
            <div class="field">
                <label style="margin-bottom: 0.5rem; color: darkgrey; font-size: smaller" for="act_email">Email
                    Perusahaan</label>
                <InputText style="width:100%" id="act_email" v-model.trim="dataEditedEmail['email']" />
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="displayDialogEmail=false" class="p-button-text" />
                <Button label="Save" icon="pi pi-check" @click="saveEditedEmail()" />
            </template>
        </Dialog>

        <!-- dialog fax perusahaan -->
        <Dialog :header="'Edit Fax'" v-model:visible="displayDialogFax" :style="{width: '50vw'}">
            <div class="field">
                <label style="margin-bottom: 0.5rem; color: darkgrey; font-size: smaller" for="act_email">Fax
                    Perusahaan</label>
                <InputText style="width:100%" id="act_email" v-model.trim="dataEditedFax['nomor_faksimili']" />
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="displayDialogFax=false" class="p-button-text" />
                <Button label="Save" icon="pi pi-check" @click="saveEditedFax()" />
            </template>
        </Dialog>

        <!-- dialog telepon perusahaan -->
        <Dialog :header="'Edit Telepon'" v-model:visible="displayDialogTelepon" :style="{width: '50vw'}">
            <div class="field">
                <label style="margin-bottom: 0.5rem; color: darkgrey; font-size: smaller" for="act_ekstensi">No
                    Ekstensi</label>
                <InputText style="width:100%" id="act_ekstensi" v-model.trim="dataEditedTelepon['nomor_ekstensi']" />
            </div>
            <div class="field">
                <label style="margin-bottom: 0.5rem; color: darkgrey; font-size: smaller" for="act_telepon">No
                    Telepon</label>
                <InputText style="width:100%" id="act_telepon" v-model.trim="dataEditedTelepon['nomor_telepon']" />
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="displayDialogTelepon=false" class="p-button-text" />
                <Button label="Save" icon="pi pi-check" @click="saveEditedTelepon()" />
            </template>
        </Dialog>

        <!-- dialog web perusahaan -->
        <Dialog :header="'Edit Website'" v-model:visible="displayDialogWeb" :style="{width: '50vw'}">
            <div class="field">
                <label style="margin-bottom: 0.5rem; color: darkgrey; font-size: smaller"
                    for="act_website">Website</label>
                <InputText style="width:100%" id="act_website" v-model.trim="dataEditedWeb['website']" />
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="displayDialogWeb=false" class="p-button-text" />
                <Button label="Save" icon="pi pi-check" @click="saveEditedWeb()" />
            </template>
        </Dialog>

        <!-- dialog cp perusahaan -->
        <Dialog :header="'Edit CP Perusahaan'" v-model:visible="displayDialogKontak" :style="{width: '50vw'}">
            <div class="field">
                <label style="margin-bottom: 0.5rem; color: darkgrey; font-size: smaller" for="act_nama_cp">Nama
                    CP</label>
                <InputText style="width:100%" id="act_nama_cp" v-model.trim="dataEditedKontak['nama']" />
            </div>
            <div class="field">
                <label style="margin-bottom: 0.5rem; color: darkgrey; font-size: smaller" for="act_email_cp">Email
                    CP</label>
                <InputText style="width:100%" id="act_email_cp" v-model.trim="dataEditedKontak['email']" />
            </div>
            <div class="field">
                <label style="margin-bottom: 0.5rem; color: darkgrey; font-size: smaller" for="act_nomor_telepon_cp">No
                    Telp CP</label>
                <InputText style="width:100%" id="act_nomor_telepon_cp"
                    v-model.trim="dataEditedKontak['nomor_telepon']" />
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="displayDialogKontak=false" class="p-button-text" />
                <Button label="Save" icon="pi pi-check" @click="saveEditedKontak()" />
            </template>
        </Dialog>

        <!-- dialog edit value text dropdown dan date -->
        <Dialog :header="'Edit Value - '+titleDialogEdit" v-model:visible="displayFormEditTextAndDate"
            :style="{width: '50vw'}">
            <div v-if="dialogTypeEdit=='text'">

                <InputText autofocus @keyup.enter="saveTempEditDialog(this.selectedKeyForEdit)" style="width:100%;"
                    v-model.trim="editedValue" />
            </div>
            <div style="text-align: center" v-else-if="dialogTypeEdit == 'date'">
                <Calendar v-model="editedValue" dateFormat="dd-mm-yy" :inline="true" />
            </div>
            <div v-else-if="dialogTypeEdit == 'dropdown'">
                <Skeleton v-if="optionEditDialog == null" width="100%" height="2.5rem" />
                <Dropdown v-else style="width: 100%" v-model="editedValue" :options="optionEditDialog"
                    optionLabel="nama" optionValue="nama" placeholder="" :filter="true" />
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="displayFormEditTextAndDate=false" class="p-button-text" />
                <Button label="Save" icon="pi pi-check" @click="saveTempEditDialog(this.selectedKeyForEdit)" />
            </template>
        </Dialog>

        <ConfirmDialog></ConfirmDialog>
        
        <div v-if="this.dataKegiatan !== null" style="position: fixed; right: 22px; bottom: 80px;">
            <SpeedDial buttonClass="p-button-danger" showIcon="pi pi-bars" hideIcon="pi pi-times" :model="itemsSpeedDial" :style="{position: 'sticky'}" direction="up" :tooltipOptions="{position: 'left'}" />        
        </div>
        <ScrollTop />
    </div>
</template>
<script>
    import DataService from '../services/DataService'
    import RadioButton from 'primevue/radiobutton'
    import InputText from 'primevue/inputtext'
    import Toast from 'primevue/toast'
    import Dialog from 'primevue/dialog'
    import ProgressBar from 'primevue/progressbar'
    import Message from 'primevue/message'
    import Toolbar from 'primevue/toolbar'
    import Breadcrumb from 'primevue/breadcrumb';
    import Calendar from 'primevue/calendar';
    import Dropdown from 'primevue/dropdown';
    import Skeleton from 'primevue/skeleton';
    import ScrollTop from 'primevue/scrolltop';
    import TreeTable from 'primevue/treetable';
    import Column from 'primevue/column';
    import InputNumber from 'primevue/inputnumber';
    import ConfirmDialog from 'primevue/confirmdialog';
    import SpeedDial from 'primevue/speeddial';

    import MyLoading from '../components/MyLoading2.vue'
    import Loading from 'vue-loading-overlay';
    import 'vue-loading-overlay/dist/vue-loading.css';    

    export default {
        components: {
            InputText,
            ProgressBar,
            Message,
            RadioButton,
            Dialog,
            Toast,
            Toolbar,
            Breadcrumb,
            MyLoading,
            Loading,
            Calendar,
            Dropdown,
            Skeleton,
            ScrollTop,
            TreeTable,
            Column,
            InputNumber,
            ConfirmDialog,
            SpeedDial
        },
        data() {
            return {
                itemsSpeedDial: [                        
                    {
                        label: 'SUBMIT',
                        icon: 'pi pi-send',
                        command: () => {
                            this.submit()
                        }
                    },
                    {
                        label: 'SKIP',
                        icon: 'pi pi-forward',
                        command: () => {
                            this.skip()
                        }
                    },
                ],
                progresAssessment: 0,
                myShadow: '',
                home: {
                    icon: 'pi pi-home',
                },
                items: [{
                    label: 'Assessment',
                    to: '/assessment'
                }, ],
                optionJenisAktivitas: [{
                        nama: 'SBR_MAIN_ACTIVITY'
                    },
                    {
                        nama: 'SBR_SECONDARY_ACTIVITY'
                    },
                    {
                        nama: 'SBR_OTHER_ACTIVITY'
                    },
                ],
                dataToSend: {},
                selectedKegiatan: null,
                kegiatanOptions: null,
                loadingDialog: false,
                errorMessages: [],
                successMessage: null,
                dataKegiatan: null,
                selectedDataNonArray: {},
                selectedDataNonArrayHidden: {},
                selectedDataValue: {},
                selectedKeyForEdit: null,
                editedValue: null,
                displayFormEditTextAndDate: false,
                titleDialogEdit: '',
                idAlokasi: null,
                idPerusahaan: null,
                optionEditDialog: null,
                metaVariable: [{
                        'variable': 'alamat',
                        'title': 'Alamat',
                        'type': 'text',
                        'value': null
                    },
                    // 'jam_buka': 'Jam Buka',
                    // 'jam_tutup': 'Jam Tutup',
                    {
                        'variable': 'jumlah_kamar',
                        'title': 'Jumlah Kamar',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'kode_pos',
                        'title': 'Kode Pos',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'kodese',
                        'title': 'Kode SE',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'latitude',
                        'title': 'Latitude',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'longitude',
                        'title': 'Longitude',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'nama',
                        'title': 'Nama Perusahaan',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'nama_komersial',
                        'title': 'Nama Komersial Perusahaan',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'nomor_kode_area',
                        'title': 'Kode Area',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'npwp',
                        'title': 'NPWP',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'pajak_tahun_pendaftarannpwp',
                        'title': 'Tahun Pendaftaran NPWP',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'pajak_tahunspt',
                        'title': 'Tahun SPT',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'pajak_tanggal_update',
                        'title': 'Tanggal Update Pajak',
                        'type': 'date',
                        'value': null
                    },
                    {
                        'variable': 'pendapatan_per_tahun',
                        'title': 'Pendapatan Per Tahun',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'tahun_ref_pendapatan',
                        'title': 'Tahun Referensi Pendapatan',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'pengeluaran_per_tahun',
                        'title': 'Pengeluaran Per Tahun',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'tahun_ref_pengeluaran',
                        'title': 'Tahun Referensi Pengeluaran',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'pengusaha_pemilik',
                        'title': 'Nama Pemilik Usaha',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'tahun_beroperasi',
                        'title': 'Tahun Perusahaan Beroperasi',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'tahun_pendirian',
                        'title': 'Tahun Perusahaan Berdiri',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'aset',
                        'title': 'Aset',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'tahun_ref_aset',
                        'title': 'Tahun Referensi Aset',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'total_kompensasi_asing_per_tahun',
                        'title': 'Total Kompensasi Asing Per Tahun',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'tahun_ref_kompensasi_asing',
                        'title': 'Tahun Referensi Kompensasi Asing',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'total_kompensasi_lokal_per_tahun',
                        'title': 'Total Kompensasi Lokal Per Tahun',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'tahun_ref_kompensasi_lokal',
                        'title': 'Tahun Referensi Kompensasi Lokal',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'total_tenaga_kerja_asing_per_tahun',
                        'title': 'Total Tenaga Kerja Asing Per Tahun',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'tahun_ref_tenaga_kerja_asing',
                        'title': 'Tahun Referensi Tenaga Kerja Asing',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'total_tenaga_kerja_lokal_per_tahun',
                        'title': 'Total Tenaga Kerja Lokal Per Tahun',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'tahun_ref_tenaga_kerja_lokal',
                        'title': 'Tahun Referensi Tenaga Kerja Lokal',
                        'type': 'text',
                        'value': null
                    },
                    {
                        'variable': 'tanggal_lahir_pengusaha',
                        'title': 'Tanggal Lahir Pengusaha',
                        'type': 'date',
                        'value': null
                    },
                    {
                        'variable': 'aktivitas_perusahaan',
                        'title': 'Aktivitas',
                        'type': 'array',
                        'value': null,
                    },
                    {
                        'variable': 'alamat_email_perusahaan',
                        'title': 'Email',
                        'type': 'array',
                        'value': null,
                    },
                    {
                        'variable': 'alamat_fax_perusahaan',
                        'title': 'Fax',
                        'type': 'array',
                        'value': null,
                    },
                    {
                        'variable': 'alamat_telepon_perusahaan',
                        'title': 'Telepon',
                        'type': 'array',
                        'value': null,
                    },
                    {
                        'variable': 'alamat_web_perusahaan',
                        'title': 'Web',
                        'type': 'array',
                        'value': null,
                    },
                    {
                        'variable': 'kontak_perusahaan',
                        'title': 'Kontak Perusahaan',
                        'type': 'array',
                        'value': null,
                    },
                    {
                        'variable': 'pemegang_saham',
                        'title': 'Saham',
                        'type': 'array',
                        'value': null,
                    },
                    {
                        'variable': 'produk_perusahaan',
                        'title': 'Produk',
                        'type': 'array',
                        'value': null,
                    },
                    {
                        'variable': 'jaringan_usaha',
                        'title': 'Jaringan Usaha',
                        'type': 'dropdown',
                        'value': null,
                        'refMaster': 'jaringan-usaha',
                        'evfunc': 'jaringan-usaha',
                        'master': null
                    },
                    {
                        'variable': 'jenis_badan_hukum_badan_usaha',
                        'title': 'Badan Hukum',
                        'type': 'dropdown',
                        'value': null,
                        'refMaster': 'badan-hukum',
                        'evfunc': 'badan-hukum',
                        'master': null
                    },
                    // {
                    //     'variable': 'kbji_pengusaha_nama',
                    //     'title': 'KBJI Pengusaha',
                    //     'type': 'dropdown',
                    //     'value': null,
                    //     'refMaster': 'kbji-pengusaha'
                    // },
                    {
                        'variable': 'kewarganegaraan_pengusaha',
                        'title': 'Kewarganegaraan Pengusaha',
                        'type': 'dropdown',
                        'value': null,
                        'refMaster': 'kewarganegaraan-pengusaha',
                        'evfunc': 'negara',
                        'master': null
                    },
                    {
                        'variable': 'pajak_jeniswp',
                        'title': 'Jenis Wajib Pajak',
                        'type': 'dropdown',
                        'value': null,
                        'refMaster': 'jeniswp',
                        'evfunc': 'jenis-wp',
                        'master': null
                    },
                    {
                        'variable': 'pajak_skala_usaha',
                        'title': 'Skala Usaha Pajak',
                        'type': 'dropdown',
                        'value': null,
                        'refMaster': 'skalawp',
                        'evfunc': 'skala-wp',
                        'master': null
                    },
                    {
                        'variable': 'pajak_statuswp',
                        'title': 'Status Wajib Pajak',
                        'type': 'dropdown',
                        'value': null,
                        'refMaster': 'statuswp',
                        'evfunc': 'status-wp',
                        'master': null
                    },
                    {
                        'variable': 'sektor_institusi',
                        'title': 'Sektor Institusi',
                        'type': 'dropdown',
                        'value': null,
                        'refMaster': 'sektor-institusi',
                        'evfunc': 'sektor-institusi',
                        'master': null
                    },
                    {
                        'variable': 'skala_usaha',
                        'title': 'Skala Usaha',
                        'type': 'dropdown',
                        'value': null,
                        'refMaster': 'skala-usaha',
                        'evfunc': null,
                        'master': [{
                                'id': null,
                                'nama': 'SBR_MIKRO',
                                'kode': 'SBR_MIKRO'
                            },
                            {
                                'id': null,
                                'nama': 'SBR_KECIL',
                                'kode': 'SBR_KECIL'
                            },
                            {
                                'id': null,
                                'nama': 'SBR_MENENGAH',
                                'kode': 'SBR_MENENGAH'
                            },
                            {
                                'id': null,
                                'nama': 'SBR_BESAR',
                                'kode': 'SBR_BESAR'
                            },
                            {
                                'id': null,
                                'nama': 'SBR_BESAR_TENTATIF',
                                'kode': 'SBR_BESAR_TENTATIF'
                            },
                        ]
                    },
                    {
                        'variable': 'tahun_ref_skala_usaha',
                        'title': 'Tahun Referensi Skala Usaha',
                        'type': 'text',
                        'value': null,
                    },
                    {
                        'variable': 'status_perusahaan',
                        'title': 'Status Perusahaan',
                        'type': 'dropdown',
                        'value': null,
                        'refMaster': 'status-perusahaan',
                        'evfunc': 'status-perusahaan',
                        'master': null
                    },
                    {
                        'variable': 'unit_statistik',
                        'title': 'Unit Statistik',
                        'type': 'dropdown',
                        'value': null,
                        'refMaster': 'unit-statistik',
                        'evfunc': null,
                        'master': [{
                                'id': null,
                                'nama': 'SBR_ENTERPRISE',
                                'kode': 'SBR_ENTERPRISE'
                            },
                            {
                                'id': null,
                                'nama': 'SBR_ENTERPRISE_GROUP',
                                'kode': 'SBR_ENTERPRISE_GROUP'
                            },
                            {
                                'id': null,
                                'nama': 'SBR_ESTABLISHMENT',
                                'kode': 'SBR_ESTABLISHMENT'
                            },
                            {
                                'id': null,
                                'nama': 'SBR_ANCILLARY_UNIT',
                                'kode': 'SBR_ANCILLARY_UNIT'
                            },
                        ]
                    },
                    {
                        'variable': 'jenis_kelamin_pengusaha',
                        'title': 'Jenis Kelamin Pengusaha',
                        'type': 'dropdown',
                        'value': null,
                        'refMaster': 'jk-pengusaha',
                        'evfunc': null,
                        'master': [{
                                'id': null,
                                'nama': 'L',
                                'kode': 'L'
                            },
                            {
                                'id': null,
                                'nama': 'P',
                                'kode': 'P'
                            },
                        ]
                    },
                    {
                        'variable': 'multi_national_status',
                        'title': 'Multinational Status',
                        'type': 'dropdown',
                        'value': null,
                        'refMaster': 'multinational-status',
                        'evfunc': null,
                        'master': [{
                                'id': null,
                                'nama': 'SBR_MNE',
                                'kode': 'SBR_MNE'
                            },
                            {
                                'id': null,
                                'nama': 'SBR_NON_MNE',
                                'kode': 'SBR_NON_MNE'
                            },
                        ]
                    },
                    {
                        'variable': 'status_kepemilikan',
                        'title': 'Status Kepemilikan',
                        'type': 'dropdown',
                        'value': null,
                        'refMaster': 'status-kepemilikan',
                        'evfunc': null,
                        'master': [{
                                'id': null,
                                'nama': 'SBR_PMDN',
                                'kode': 'SBR_PMDN'
                            },
                            {
                                'id': null,
                                'nama': 'SBR_PMA',
                                'kode': 'SBR_PMA'
                            },
                        ]
                    },
                    {
                        'variable': 'negara',
                        'title': 'Negara',
                        'type': 'dropdown',
                        'value': null,
                        'refMaster': 'negara-perusahaan',
                        'evfunc': 'negara',
                        'master': null
                    },
                    {
                        'variable': 'provinsi',
                        'title': 'Provinsi',
                        'type': 'dropdown',
                        'value': null,
                        'refMaster': 'provinsi-perusahaan',
                        'evfunc': 'provinsi',
                        'master': null
                    },
                    {
                        'variable': 'kabupaten_kota',
                        'title': 'Kabupaten/Kota',
                        'type': 'dropdown',
                        'value': null,
                        'refMaster': 'kabupaten-perusahaan',
                        'evfunc': 'kabupaten',
                        'master': null
                    },
                    {
                        'variable': 'kecamatan',
                        'title': 'Kecamatan',
                        'type': 'dropdown',
                        'value': null,
                        'refMaster': 'kecamatan-perusahaan',
                        'evfunc': 'kecamatan',
                        'master': null
                    },
                    {
                        'variable': 'kelurahan_desa',
                        'title': 'Desa',
                        'type': 'dropdown',
                        'value': null,
                        'refMaster': 'desa-perusahaan',
                        'evfunc': 'desa',
                        'master': null
                    },

                ],
                dialogTypeEdit: null,
                masterJaringanUsaha: null,
                masterBadanHukum: null,
                masterNegara: null,
                masterJenisWP: null,
                masterSkalaWP: null,
                masterStatusWP: null,
                masterSektorInstitusi: null,
                masterSkalaUsaha: [{
                        'id': null,
                        'nama': 'SBR_MIKRO',
                        'kode': 'SBR_MIKRO'
                    },
                    {
                        'id': null,
                        'nama': 'SBR_KECIL',
                        'kode': 'SBR_KECIL'
                    },
                    {
                        'id': null,
                        'nama': 'SBR_MENENGAH',
                        'kode': 'SBR_MENENGAH'
                    },
                    {
                        'id': null,
                        'nama': 'SBR_BESAR',
                        'kode': 'SBR_BESAR'
                    },
                    {
                        'id': null,
                        'nama': 'SBR_BESAR_TENTATIF',
                        'kode': 'SBR_BESAR_TENTATIF'
                    },
                ],
                masterStatusPerusahaan: null,
                masterUnitStatistik: [{
                        'id': null,
                        'nama': 'SBR_ENTERPRISE',
                        'kode': 'SBR_ENTERPRISE'
                    },
                    {
                        'id': null,
                        'nama': 'SBR_ENTERPRISE_GROUP',
                        'kode': 'SBR_ENTERPRISE_GROUP'
                    },
                    {
                        'id': null,
                        'nama': 'SBR_ESTABLISHMENT',
                        'kode': 'SBR_ESTABLISHMENT'
                    },
                    {
                        'id': null,
                        'nama': 'SBR_ANCILLARY_UNIT',
                        'kode': 'SBR_ANCILLARY_UNIT'
                    },
                ],
                masterJkPengusaha: [{
                        'id': null,
                        'nama': 'L',
                        'kode': 'L'
                    },
                    {
                        'id': null,
                        'nama': 'P',
                        'kode': 'P'
                    },
                ],
                masterMultinationalStatus: [{
                        'id': null,
                        'nama': 'SBR_MNE',
                        'kode': 'SBR_MNE'
                    },
                    {
                        'id': null,
                        'nama': 'SBR_NON_MNE',
                        'kode': 'SBR_NON_MNE'
                    },
                ],
                masterStatusKepemilikan: [{
                        'id': null,
                        'nama': 'SBR_PMDN',
                        'kode': 'SBR_PMDN'
                    },
                    {
                        'id': null,
                        'nama': 'SBR_PMA',
                        'kode': 'SBR_PMA'
                    },
                ],
                masterProvinsi: null,
                masterKabupatenKota: null,
                masterKecamatan: null,
                masterDesa: null,
                masterDropdown: null,
                dataAssessmentNonArray: null,
                dataAssessmentArray: null,

                displayDialogAktivitas: false,
                dataEditedAktivitas: {},
                dataAssessmentAktivitas: null,
                tempDataAssessmentAktivitas: null,

                displayDialogProduk: false,
                dataEditedProduk: {},
                dataAssessmentProduk: null,
                tempDataAssessmentProduk: null,

                displayDialogSaham: false,
                dataEditedSaham: {},
                dataAssessmentSaham: null,
                tempDataAssessmentSaham: null,

                displayDialogEmail: false,
                dataEditedEmail: {},
                dataAssessmentEmail: null,
                tempDataAssessmentEmail: null,

                displayDialogFax: false,
                dataEditedFax: {},
                dataAssessmentFax: null,
                tempDataAssessmentFax: null,

                displayDialogTelepon: false,
                dataEditedTelepon: {},
                dataAssessmentTelepon: null,
                tempDataAssessmentTelepon: null,

                displayDialogWeb: false,
                dataEditedWeb: {},
                dataAssessmentWeb: null,
                tempDataAssessmentWeb: null,

                displayDialogKontak: false,
                dataEditedKontak: {},
                dataAssessmentKontak: null,
                tempDataAssessmentKontak: null,

                isIframeShow: false,
                isFreshLoad: true,
                onLoadData: false,

                prid: null,
            }
        },
        async created() {
            try {
                // const listKegiatan = await DataService.getKegiatanActiveAssessment()
                const listKegiatan = await DataService.getDaftarKegiatanAssessmentUser(this.currentUser.id, 'active')
                this.kegiatanOptions = listKegiatan.data
            } catch (error) {
                console.log(error)
            }        
        },
        watch: {            
            displayFormEditTextAndDate(value) {
                // klo dialog nutup
                if (!value) {
                    this.optionEditDialog = null
                }
            },
            displayDialogAktivitas(value) {
                if (!value) this.dataEditedAktivitas = {}
            },
        },
        computed: {                        
            currentUser() {
                return this.$store.state.auth.user
            }
        },
        methods: {
            addNew(field) {
                switch(field) {
                    case 'aktivitas':
                        this.openDialogAktivitas(
                            {
                                index: this.dataAssessmentAktivitas.length,
                                data: {
                                    id: null,
                                    aktivitas: null,
                                    jenis: null,
                                    kategori: null,
                                    kbli: null,
                                    tpsumber: 'sbr',
                                    orisumber: 'assessment-new',
                                    perusahaan_id: null,
                                    sumber: 'Data Assessment - New Data'
                                }
                            }
                        )
                        break
                    default:
                        break
                }

            },
            loadIframe() {
                this.isIframeShow = true
                this.isFreshLoad = false
            },
            removeAktivitasFromSBR(index) {
                let removedData = this.dataAssessmentAktivitas.splice(index, 1),
                    tempIndex = parseInt(removedData[0]['key']),
                    reAss = this.dataKegiatan.data_assessment[tempIndex]


                this.tempDataAssessmentAktivitas.push({
                    'key': removedData[0]['key'].toString(),
                    'data': {
                        'name': reAss['sumber_data'] + '-' + (tempIndex + 1),
                        'type': 'button',
                        'value': null
                    },
                    'children': [{
                            'key': tempIndex + '-0',
                            'data': {
                                'name': 'Aktivitas',
                                'type': 'Text',
                                'value': reAss['aktivitas_perusahaan']
                            }
                        },
                        {
                            'key': tempIndex + '-1',
                            'data': {
                                'name': 'Jenis',
                                'type': 'Text',
                                'value': '-'
                            },
                            
                        },
                        {
                            'key': tempIndex + '-2',
                            'data': {
                                'name': 'Kategori',
                                'type': 'Text',
                                'value': reAss['kategori_aktivitas_perusahaan']
                            }
                        },
                        {
                            'key': tempIndex + '-3',
                            'data': {
                                'name': 'KBLI',
                                'type': 'Text',
                                'value': reAss['kbli_aktivitas_perusahaan']
                            }
                        }
                    ],
                })
                // console.log(removedData, reAss)
            },
            removeProdukFromSBR(index) {
                let removedData = this.dataAssessmentProduk.splice(index, 1),
                    tempIndex = parseInt(removedData[0]['key']),
                    reAss = this.dataKegiatan.data_assessment[tempIndex]


                this.tempDataAssessmentProduk.push({
                    'key': removedData[0]['key'].toString(),
                    'data': {
                        'name': reAss['sumber_data'] + '-' + (tempIndex + 1),
                        'type': 'button',
                        'value': null
                    },
                    'children': [{
                            'key': tempIndex + '-0',
                            'data': {
                                'name': 'Produk',
                                'type': 'text',
                                'value': reAss['produk_perusahaan']
                            }
                        },
                        {
                            'key': tempIndex + '-1',
                            'data': {
                                'name': 'KBKI',
                                'type': 'text',
                                'value': reAss['kbki_produk_perusahaan']
                            }
                        },
                    ],
                })
            },
            removeSahamFromSBR(index) {
                let removedData = this.dataAssessmentSaham.splice(index, 1),
                    tempIndex = parseInt(removedData[0]['key']),
                    reAss = this.dataKegiatan.data_assessment[tempIndex]


                this.tempDataAssessmentSaham.push({
                    'key': removedData[0]['key'].toString(),
                    'data': {
                        'name': reAss['sumber_data'] + '-' + (tempIndex + 1),
                        'type': 'button',
                        'value': null
                    },
                    'children': [{
                            'key': tempIndex + '-0',
                            'data': {
                                'name': 'Pemegang Saham',
                                'type': 'text',
                                'value': reAss['pemegang_saham']
                            }
                        },
                        {
                            'key': tempIndex + '-1',
                            'data': {
                                'name': 'Persentase Saham',
                                'type': 'text',
                                'value': reAss['persentase_saham']
                            }
                        },
                    ],
                })
            },
            removeEmailFromSBR(index) {
                let removedData = this.dataAssessmentEmail.splice(index, 1),
                    tempIndex = parseInt(removedData[0]['key']),
                    reAss = this.dataKegiatan.data_assessment[tempIndex]


                this.tempDataAssessmentEmail.push({
                    'key': removedData[0]['key'].toString(),
                    'data': {
                        'name': reAss['sumber_data'] + '-' + (tempIndex + 1),
                        'type': 'button',
                        'value': null
                    },
                    'children': [{
                        'key': tempIndex + '-0',
                        'data': {
                            'name': 'Email',
                            'type': 'text',
                            'value': reAss['alamat_email_perusahaan']
                        }
                    }, ],
                })
            },
            removeFaxFromSBR(index) {
                let removedData = this.dataAssessmentFax.splice(index, 1),
                    tempIndex = parseInt(removedData[0]['key']),
                    reAss = this.dataKegiatan.data_assessment[tempIndex]


                this.tempDataAssessmentFax.push({
                    'key': removedData[0]['key'].toString(),
                    'data': {
                        'name': reAss['sumber_data'] + '-' + (tempIndex + 1),
                        'type': 'button',
                        'value': null
                    },
                    'children': [{
                        'key': tempIndex + '-0',
                        'data': {
                            'name': 'Fax',
                            'type': 'text',
                            'value': reAss['alamat_fax_perusahaan']
                        }
                    }, ],
                })
            },
            removeTeleponFromSBR(index) {
                let removedData = this.dataAssessmentTelepon.splice(index, 1),
                    tempIndex = parseInt(removedData[0]['key']),
                    reAss = this.dataKegiatan.data_assessment[tempIndex]


                this.tempDataAssessmentTelepon.push({
                    'key': removedData[0]['key'].toString(),
                    'data': {
                        'name': reAss['sumber_data'] + '-' + (tempIndex + 1),
                        'type': 'button',
                        'value': null
                    },
                    'children': [{
                        'key': tempIndex + '-0',
                        'data': {
                            'name': 'Telepon',
                            'type': 'text',
                            'value': reAss['alamat_telepon_perusahaan']
                        }
                    }, ],
                })
            },
            removeWebFromSBR(index) {
                let removedData = this.dataAssessmentWeb.splice(index, 1),
                    tempIndex = parseInt(removedData[0]['key']),
                    reAss = this.dataKegiatan.data_assessment[tempIndex]


                this.tempDataAssessmentWeb.push({
                    'key': removedData[0]['key'].toString(),
                    'data': {
                        'name': reAss['sumber_data'] + '-' + (tempIndex + 1),
                        'type': 'button',
                        'value': null
                    },
                    'children': [{
                        'key': tempIndex + '-0',
                        'data': {
                            'name': 'Website',
                            'type': 'text',
                            'value': reAss['alamat_web_perusahaan']
                        }
                    }, ],
                })
            },
            removeKontakFromSBR(index) {
                let removedData = this.dataAssessmentKontak.splice(index, 1),
                    tempIndex = parseInt(removedData[0]['key']),
                    reAss = this.dataKegiatan.data_assessment[tempIndex]


                this.tempDataAssessmentKontak.push({
                    'key': removedData[0]['key'].toString(),
                    'data': {
                        'name': reAss['sumber_data'] + '-' + (tempIndex + 1),
                        'type': 'button',
                        'value': null
                    },
                    'children': [{
                            'key': tempIndex + '-0',
                            'data': {
                                'name': 'Nama CP',
                                'type': 'text',
                                'value': reAss['kontak_perusahaan_nama']
                            }
                        },
                        {
                            'key': tempIndex + '-1',
                            'data': {
                                'name': 'Email CP',
                                'type': 'text',
                                'value': reAss['kontak_perusahaan_email']
                            }
                        },
                        {
                            'key': tempIndex + '-2',
                            'data': {
                                'name': 'No Telp CP',
                                'type': 'text',
                                'value': reAss['kontak_perusahaan_nomor_telepon']
                            }
                        },
                    ],
                })
            },
            addAktivitasToSBR(data) {

                // remove from assessment value
                this.tempDataAssessmentAktivitas = this.tempDataAssessmentAktivitas.filter((dt) => dt.key != data.node
                    .key);

                let temp = this.dataKegiatan.data_assessment[data.node.key]
                this.dataAssessmentAktivitas.push({
                    'key': data.node.key,
                    'id': null,
                    'status': 'SAVED',
                    'orisumber': 'assessment',
                    'tpsumber': 'sbr',
                    'sumber': 'Data Assessment (' + temp['sumber_data'] + ')',
                    'aktivitas': temp['aktivitas_perusahaan'],
                    'jenis': '-',
                    'kategori': temp['kategori_aktivitas_perusahaan'],
                    'kbli': temp['kbli_aktivitas_perusahaan'],
                    'perusahaan_id': temp['perusahaan_id']
                })

            },
            addProdukToSBR(data) {
                // remove from assessment value
                this.tempDataAssessmentProduk = this.tempDataAssessmentProduk.filter((dt) => dt.key != data.node
                    .key);

                let temp = this.dataKegiatan.data_assessment[data.node.key]
                this.dataAssessmentProduk.push({
                    'key': data.node.key,
                    'id': null,
                    'status': 'SAVED',
                    'orisumber': 'assessment',
                    'tpsumber': 'sbr',
                    'sumber': 'Data Assessment (' + temp['sumber_data'] + ')',
                    'produk': temp['produk_perusahaan'],
                    'kbki': temp['kbki_produk_perusahaan'],
                    'perusahaan_id': temp['perusahaan_id']
                })
            },
            addSahamToSBR(data) {
                // remove from assessment value
                this.tempDataAssessmentSaham = this.tempDataAssessmentSaham.filter((dt) => dt.key != data.node
                    .key);

                let temp = this.dataKegiatan.data_assessment[data.node.key]
                this.dataAssessmentSaham.push({
                    'key': data.node.key,
                    'id': null,
                    'status': 'SAVED',
                    'orisumber': 'assessment',
                    'tpsumber': 'sbr',
                    'sumber': 'Data Assessment (' + temp['sumber_data'] + ')',
                    'pemegang_saham': temp['pemegang_saham'],
                    'persentase_saham': temp['persentase_saham'],
                    'perusahaan_id': temp['perusahaan_id']
                })
            },
            addEmailToSBR(data) {
                // remove from assessment value
                this.tempDataAssessmentEmail = this.tempDataAssessmentEmail.filter((dt) => dt.key != data.node
                    .key);

                let temp = this.dataKegiatan.data_assessment[data.node.key]
                this.dataAssessmentEmail.push({
                    'key': data.node.key,
                    'id': null,
                    'status': 'SAVED',
                    'orisumber': 'assessment',
                    'tpsumber': 'sbr',
                    'sumber': 'Data Assessment (' + temp['sumber_data'] + ')',
                    'email': temp['alamat_email_perusahaan'],
                    'perusahaan_id': temp['perusahaan_id']
                })
            },
            addFaxToSBR(data) {
                // remove from assessment value
                this.tempDataAssessmentFax = this.tempDataAssessmentFax.filter((dt) => dt.key != data.node
                    .key);

                let temp = this.dataKegiatan.data_assessment[data.node.key]
                this.dataAssessmentFax.push({
                    'key': data.node.key,
                    'id': null,
                    'status': 'SAVED',
                    'orisumber': 'assessment',
                    'tpsumber': 'sbr',
                    'sumber': 'Data Assessment (' + temp['sumber_data'] + ')',
                    'nomor_faksimili': temp['alamat_fax_perusahaan'],
                    'perusahaan_id': temp['perusahaan_id']
                })
            },
            addTeleponToSBR(data) {
                // remove from assessment value
                this.tempDataAssessmentTelepon = this.tempDataAssessmentTelepon.filter((dt) => dt.key != data.node
                    .key);

                let temp = this.dataKegiatan.data_assessment[data.node.key]
                this.dataAssessmentTelepon.push({
                    'key': data.node.key,
                    'id': null,
                    'status': 'SAVED',
                    'orisumber': 'assessment',
                    'tpsumber': 'sbr',
                    'sumber': 'Data Assessment (' + temp['sumber_data'] + ')',
                    'nomor_ekstensi': null,
                    'nomor_telepon': temp['alamat_telepon_perusahaan'],
                    'perusahaan_id': temp['perusahaan_id']
                })
            },
            addWebToSBR(data) {
                // remove from assessment value
                this.tempDataAssessmentWeb = this.tempDataAssessmentWeb.filter((dt) => dt.key != data.node
                    .key);

                let temp = this.dataKegiatan.data_assessment[data.node.key]
                this.dataAssessmentWeb.push({
                    'key': data.node.key,
                    'id': null,
                    'status': 'SAVED',
                    'orisumber': 'assessment',
                    'tpsumber': 'sbr',
                    'sumber': 'Data Assessment (' + temp['sumber_data'] + ')',
                    'website': temp['website'],
                    'perusahaan_id': temp['perusahaan_id']
                })
            },
            addKontakToSBR(data) {
                // remove from assessment value
                this.tempDataAssessmentKontak = this.tempDataAssessmentKontak.filter((dt) => dt.key != data.node
                    .key);

                let temp = this.dataKegiatan.data_assessment[data.node.key]
                this.dataAssessmentKontak.push({
                    'key': data.node.key,
                    'id': null,
                    'status': 'SAVED',
                    'orisumber': 'assessment',
                    'tpsumber': 'sbr',
                    'sumber': 'Data Assessment (' + temp['sumber_data'] + ')',
                    'email': temp['kontak_perusahaan_email'],
                    'nama': temp['kontak_perusahaan_nama'],
                    'nomor_telepon': temp['kontak_perusahaan_nomor_telepon'],
                    'perusahaan_id': temp['perusahaan_id']
                })
            },
            onChangeValue(param, source, index = null) {
                if (param == 'kabupaten_kota' && this.selectedDataNonArray['provinsi'] == null) {
                    this.toastMessage('error', 'Error!', 'Ups, Isian provinsi harus terisi dahulu! :(');
                    this.selectedDataNonArray[param] = null;
                    return;
                }
                if (param == 'kecamatan' && this.selectedDataNonArray['kabupaten_kota'] == null) {
                    this.toastMessage('error', 'Error!', 'Ups, Isian kabupaten/kota harus terisi dahulu! :(');
                    this.selectedDataNonArray[param] = null;
                    return;
                }
                if (param == 'kelurahan_desa' && this.selectedDataNonArray['kecamatan'] == null) {
                    this.toastMessage('error', 'Error!', 'Ups, Isian kecamatan harus terisi dahulu! :(');
                    this.selectedDataNonArray[param] = null;
                    return;
                }

                let tempT = this.dataAssessmentNonArray.filter((data) => data.variable == param)
                // console.log(tempT, source, index)
                if (tempT[0]['type'] == 'dropdown' && tempT[0]['evfunc'] != null) {
                    this.selectedDataNonArrayHidden[param + '_id'] = index == null ? tempT[0]['value'][source]['id'] :
                        tempT[0]['value'][source][index]['id']
                } else {
                    this.selectedDataNonArrayHidden[param] = index == null ? tempT[0]['value'][source]['value'] : tempT[
                        0]['value'][source][index]['value']
                }
                // console.log(this.selectedDataNonArrayHidden)
            },
            saveTempEditDialog(keyEdit) {

                this.displayFormEditTextAndDate = false;
                let tempT = this.dataAssessmentNonArray.filter((data) => data.variable == keyEdit)
                if (tempT[0]['type'] == 'dropdown' && tempT[0]['evfunc'] != null) {
                    let tempY = this.optionEditDialog.filter((ev) => ev.nama == this.editedValue)
                    this.selectedDataNonArrayHidden[keyEdit + '_id'] = tempY[0]['id']
                } else if (tempT[0]['type'] == 'date') {
                    this.selectedDataNonArrayHidden[keyEdit] = this.convertDate(this.editedValue)
                } else {
                    this.selectedDataNonArrayHidden[keyEdit] = this.editedValue ? this.editedValue : null
                }
                this.selectedDataNonArray[keyEdit] = this.editedValue

                if (keyEdit == 'provinsi') {
                    this.selectedDataNonArray['kabupaten_kota'] = null
                    this.selectedDataNonArrayHidden['kabupaten_kota_id'] = null
                    this.selectedDataNonArray['kecamatan'] = null
                    this.selectedDataNonArrayHidden['kecamatan_id'] = null
                    this.selectedDataNonArray['kelurahan_desa'] = null
                    this.selectedDataNonArrayHidden['kelurahan_desa_id'] = null
                }

                if (keyEdit == 'kabupaten_kota') {
                    this.selectedDataNonArray['kecamatan'] = null
                    this.selectedDataNonArrayHidden['kecamatan_id'] = null
                    this.selectedDataNonArray['kelurahan_desa'] = null
                    this.selectedDataNonArrayHidden['kelurahan_desa_id'] = null
                }

                if (keyEdit == 'kecamatan') {
                    this.selectedDataNonArray['kelurahan_desa'] = null
                    this.selectedDataNonArrayHidden['kelurahan_desa_id'] = null
                }
                // console.log(this.selectedDataNonArrayHidden)
            },
            skip() {
                this.getData()
            },
            convertDate(data) {
                if (data == null) return;

                let year = data.getFullYear(),
                    month = data.getMonth() + 1 < 10 ? '0' + (data.getMonth() + 1) : data.getMonth() + 1,
                    day = data.getDate() < 10 ? '0' + data.getDate() : data.getDate();
                return `${year}-${month}-${day}`
            },
            submit() {

                console.log(this.dataAssessmentAktivitas)

                this.dataToSend = {
                    ...this.selectedDataNonArrayHidden
                }
                this.dataToSend['id_perusahaan'] = this.dataKegiatan.id_perusahaan
                this.dataToSend['id_alokasi'] = this.dataKegiatan.id_alokasi
                this.dataToSend['idsbr'] = this.dataKegiatan.data_sbr.idsbr


                this.dataToSend['aktivitas_perusahaan'] = this.dataAssessmentAktivitas
                this.dataToSend['produk_perusahaan'] = this.dataAssessmentProduk
                this.dataToSend['pemegang_saham'] = this.dataAssessmentSaham
                this.dataToSend['alamat_email_perusahaan'] = this.dataAssessmentEmail
                this.dataToSend['alamat_fax_perusahaan'] = this.dataAssessmentFax
                this.dataToSend['alamat_telepon_perusahaan'] = this.dataAssessmentTelepon
                this.dataToSend['alamat_web_perusahaan'] = this.dataAssessmentWeb
                this.dataToSend['kontak_perusahaan'] = this.dataAssessmentKontak

                this.$confirm.require({
                    message: 'Are you sure you want to proceed?',
                    header: 'Confirmation',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        this.loadingDialog = true
                        this.sendData()
                    },
                    reject: () => {
                        // this.$toast.add({severity:'error', summary:'Rejected', detail:'You have rejected', life: 3000});
                    }
                });


            },
            async sendData() {
                try {
                    const response = await DataService.postDataAssessment(this.dataToSend, this.selectedKegiatan.id_kegiatan, this.currentUser.id)
                    if(response.data.meta.status == 'error') throw new Error(response.data.meta.message)
                    this.toastMessage('success', 'Success!', 'Berhasil menyimpan data!');                            
                    this.getData()
                } catch(error) {
                    console.log('err', error)
                    this.toastMessage('error', 'Error!', 'Something went wrong!');
                    this.loadingDialog = false
                }
            },
            saveEditedAktivitas() {
                this.displayDialogAktivitas = false
                if(this.dataAssessmentAktivitas[this.dataEditedAktivitas['index']] == undefined) {
                    this.dataAssessmentAktivitas[this.dataEditedAktivitas['index']] = {}
                    this.dataAssessmentAktivitas[this.dataEditedAktivitas['index']]['tpsumber'] = this.dataEditedAktivitas[
                    'tpsumber']
                    this.dataAssessmentAktivitas[this.dataEditedAktivitas['index']]['orisumber'] = this.dataEditedAktivitas[
                    'orisumber']
                    this.dataAssessmentAktivitas[this.dataEditedAktivitas['index']]['sumber'] = this.dataEditedAktivitas[
                    'sumber']
                    this.dataAssessmentAktivitas[this.dataEditedAktivitas['index']]['id'] = null
                    this.dataAssessmentAktivitas[this.dataEditedAktivitas['index']]['perusahaan_id'] = this.prid
                }
                this.dataAssessmentAktivitas[this.dataEditedAktivitas['index']]['aktivitas'] = this.dataEditedAktivitas[
                    'aktivitas'] ? this.dataEditedAktivitas[
                    'aktivitas'] : null
                this.dataAssessmentAktivitas[this.dataEditedAktivitas['index']]['jenis'] = this.dataEditedAktivitas[
                    'jenis'] ? this.dataEditedAktivitas[
                    'jenis'] : null
                this.dataAssessmentAktivitas[this.dataEditedAktivitas['index']]['kategori'] = this.dataEditedAktivitas[
                    'kategori'] ? this.dataEditedAktivitas[
                    'kategori'] : null
                this.dataAssessmentAktivitas[this.dataEditedAktivitas['index']]['kbli'] = this.dataEditedAktivitas[
                    'kbli'] ? this.dataEditedAktivitas[
                    'kbli'] : null
                // console.log(this.dataAssessmentAktivitas)
            },
            saveEditedProduk() {
                this.displayDialogProduk = false
                this.dataAssessmentProduk[this.dataEditedProduk['index']]['produk'] = this.dataEditedProduk[
                    'produk'] ? this.dataEditedProduk[
                    'produk'] : null
                this.dataAssessmentProduk[this.dataEditedProduk['index']]['kbki'] = this.dataEditedProduk[
                    'kbki'] ? this.dataEditedProduk[
                    'kbki'] : null
            },
            saveEditedSaham() {
                this.displayDialogSaham = false
                this.dataAssessmentSaham[this.dataEditedSaham['index']]['pemegang_saham'] = this.dataEditedSaham[
                    'pemegang_saham'] ? this.dataEditedSaham[
                    'pemegang_saham'] : null
                this.dataAssessmentSaham[this.dataEditedSaham['index']]['persentase_saham'] = this.dataEditedSaham[
                    'persentase_saham'] ? this.dataEditedSaham[
                    'persentase_saham'] : null
            },
            saveEditedEmail() {
                this.displayDialogEmail = false
                this.dataAssessmentEmail[this.dataEditedEmail['index']]['email'] = this.dataEditedEmail[
                    'email'] ? this.dataEditedEmail[
                    'email'] : null
            },
            saveEditedFax() {
                this.displayDialogFax = false
                this.dataAssessmentFax[this.dataEditedFax['index']]['nomor_faksimili'] = this.dataEditedFax[
                    'nomor_faksimili'] ? this.dataEditedFax[
                    'nomor_faksimili'] : null
            },
            saveEditedTelepon() {
                this.displayDialogTelepon = false
                this.dataAssessmentTelepon[this.dataEditedTelepon['index']]['nomor_ekstensi'] = this.dataEditedTelepon[
                    'nomor_ekstensi'] ? this.dataEditedTelepon[
                    'nomor_ekstensi'] : null
                this.dataAssessmentTelepon[this.dataEditedTelepon['index']]['nomor_telepon'] = this.dataEditedTelepon[
                    'nomor_telepon'] ? this.dataEditedTelepon[
                    'nomor_telepon'] : null
            },
            saveEditedWeb() {
                this.displayDialogWeb = false
                this.dataAssessmentWeb[this.dataEditedWeb['index']]['website'] = this.dataEditedWeb[
                    'website'] ? this.dataEditedWeb[
                    'website'] : null
            },
            saveEditedKontak() {
                this.displayDialogKontak = false
                this.dataAssessmentKontak[this.dataEditedKontak['index']]['nama'] = this.dataEditedKontak[
                    'nama'] ? this.dataEditedKontak[
                    'nama'] : null
                this.dataAssessmentKontak[this.dataEditedKontak['index']]['email'] = this.dataEditedKontak[
                    'email'] ? this.dataEditedKontak[
                    'email'] : null
                this.dataAssessmentKontak[this.dataEditedKontak['index']]['nomor_telepon'] = this.dataEditedKontak[
                    'nomor_telepon'] ? this.dataEditedKontak[
                    'nomor_telepon'] : null
            },
            openDialogAktivitas(data) {
                this.displayDialogAktivitas = true                
                this.dataEditedAktivitas['index'] = data.index
                this.dataEditedAktivitas['aktivitas'] = data.data.aktivitas
                this.dataEditedAktivitas['jenis'] = data.data.jenis
                this.dataEditedAktivitas['kategori'] = data.data.kategori
                this.dataEditedAktivitas['kbli'] = data.data.kbli
                this.dataEditedAktivitas['tpsumber'] = data.data.tpsumber
                this.dataEditedAktivitas['orisumber'] = data.data.orisumber
                this.dataEditedAktivitas['sumber'] = data.data.sumber
                console.log(this.dataEditedAktivitas)
            },
            openDialogProduk(data) {
                this.displayDialogProduk = true
                this.dataEditedProduk['index'] = data.index
                this.dataEditedProduk['produk'] = data.data.produk
                this.dataEditedProduk['kbki'] = data.data.kbki
            },
            openDialogSaham(data) {
                this.displayDialogSaham = true
                this.dataEditedSaham['index'] = data.index
                this.dataEditedSaham['pemegang_saham'] = data.data.pemegang_saham
                this.dataEditedSaham['persentase_saham'] = data.data.persentase_saham
            },
            openDialogEmail(data) {
                this.displayDialogEmail = true
                this.dataEditedEmail['index'] = data.index
                this.dataEditedEmail['email'] = data.data.email
            },
            openDialogFax(data) {
                this.displayDialogFax = true
                this.dataEditedFax['index'] = data.index
                this.dataEditedFax['nomor_faksimili'] = data.data.nomor_faksimili
            },
            openDialogTelepon(data) {
                this.displayDialogTelepon = true
                this.dataEditedTelepon['index'] = data.index
                this.dataEditedTelepon['nomor_ekstensi'] = data.data.nomor_ekstensi
                this.dataEditedTelepon['nomor_telepon'] = data.data.nomor_telepon
            },
            openDialogWeb(data) {
                this.displayDialogWeb = true
                this.dataEditedWeb['index'] = data.index
                this.dataEditedWeb['website'] = data.data.website
            },
            openDialogKontak(data) {
                this.displayDialogKontak = true
                this.dataEditedKontak['index'] = data.index
                this.dataEditedKontak['email'] = data.data.email
                this.dataEditedKontak['nama'] = data.data.nama
                this.dataEditedKontak['nomor_telepon'] = data.data.nomor_telepon
            },
            rowClass(data) {
                return data.tpsumber === 'assessment' ? 'row-assessment' : null;
            },
            isAssessmentDone(response) {
                let status = false;
                if (response.data.data.summary.sudah_assessment == response.data.data.summary
                    .total_data_assessment) {
                    this.dataKegiatan = null
                    this.dataAssessmentNonArray = null
                    this.errorMessages = []
                    this.successMessage = "Selamat. Kamu sudah selesai Assessment"
                    this.loadingDialog = false
                    status = true
                }
                return status
            },
            assigningVariableNonArray() {
                let variableNonArray = this.metaVariable.filter(object => {
                    return ['text', 'date', 'dropdown'].includes(object.type);
                });

                for (let i = 0; i < variableNonArray.length; i++) {
                    let tempVar = {},
                        isEqualTemp = true,
                        isAllAssessmentNull = true;

                    tempVar['sbr'] = {
                        'value': this.dataKegiatan.data_sbr[variableNonArray[i]['variable'] + (
                            variableNonArray[i]['type'] == 'dropdown' &&
                            variableNonArray[i]['evfunc'] != null ? '_nama' : '')],
                        'id': variableNonArray[i]['type'] == 'dropdown' && variableNonArray[i][
                            'evfunc'
                        ] != null ? this.dataKegiatan.data_sbr[variableNonArray[i][
                            'variable'
                        ] + '_id'] : null,
                        'nama': variableNonArray[i]['type'] == 'dropdown' && variableNonArray[i]
                            ['evfunc'] != null ? this.dataKegiatan.data_sbr[variableNonArray[i][
                                'variable'
                            ] + '_nama'] : null,
                        'kode': variableNonArray[i]['type'] == 'dropdown' && variableNonArray[i]
                            ['evfunc'] != null ? this.dataKegiatan.data_sbr[variableNonArray[i][
                                'variable'
                            ] + '_kode'] : null,
                    };

                    // update data yang tipenya date
                    if (variableNonArray[i]['type'] == 'date' && tempVar['sbr']['value'] != null)
                        tempVar['sbr']['value'] = new Date(tempVar['sbr']['value'])

                    let tempAss = [];
                    for (let j = 0; j < this.dataKegiatan.data_assessment.length; j++) {
                        let tempAssEach = {
                            'sumber': this.dataKegiatan.data_assessment[j].sumber_data,
                            'no': j + 1,
                            'value': this.dataKegiatan.data_assessment[j][variableNonArray[i][
                                'variable'
                            ] + (variableNonArray[i]['type'] == 'dropdown' &&
                                variableNonArray[i]['evfunc'] != null ? '_nama' : '')],
                            'id': variableNonArray[i]['type'] == 'dropdown' && variableNonArray[
                                i]['evfunc'] != null ? this.dataKegiatan.data_assessment[j][
                                variableNonArray[i]['variable'] + '_id'
                            ] : null,
                            'nama': variableNonArray[i]['type'] == 'dropdown' &&
                                variableNonArray[i]['evfunc'] != null ? this.dataKegiatan
                                .data_assessment[j][variableNonArray[i]['variable'] + '_nama'] : null,
                            'kode': variableNonArray[i]['type'] == 'dropdown' &&
                                variableNonArray[i]['evfunc'] != null ? this.dataKegiatan
                                .data_assessment[j][variableNonArray[i]['variable'] + '_kode'] : null,
                        }

                        // update data yang tipenya date
                        if (variableNonArray[i]['type'] == 'date' && tempAssEach['value'] != null)
                            tempAssEach['value'] = new Date(tempAssEach['value'])

                        tempAss.push(tempAssEach)
                        if (tempVar['sbr']['value'] != tempAssEach['value']) isEqualTemp = false
                        if (tempAssEach['value'] != null && tempAssEach['value'] != '')
                            isAllAssessmentNull = false
                    }
                    tempVar['assessment'] = tempAss;
                    variableNonArray[i]['value'] = tempVar;

                    // assigning default value                            
                    this.selectedDataNonArray[variableNonArray[i]['variable']] = isEqualTemp ?
                        tempVar['sbr']['value'] : (isAllAssessmentNull && tempVar['sbr']['value'] !=
                            null ? tempVar['sbr']['value'] : null);

                    if (variableNonArray[i]['type'] == 'dropdown' && variableNonArray[i][
                            'evfunc'
                        ] != null) {
                        this.selectedDataNonArrayHidden[variableNonArray[i]['variable'] + '_id'] =
                            isEqualTemp || (isAllAssessmentNull && tempVar['sbr']['value'] !=
                                null) ? tempVar['sbr']['id'] : null
                    } else {
                        this.selectedDataNonArrayHidden[variableNonArray[i]['variable']] =
                            isEqualTemp || (isAllAssessmentNull && tempVar['sbr']['value'] !=
                                null) ? tempVar['sbr']['value'] : null
                        if (variableNonArray[i]['type'] == 'date') this.selectedDataNonArrayHidden[
                            variableNonArray[i]['variable']] = this.convertDate(this
                            .selectedDataNonArrayHidden[variableNonArray[i]['variable']])
                    }

                }

                this.dataAssessmentNonArray = variableNonArray;
            },
            assigningVariableAktivitas() {
                let tempDataAktivitas = [];
                let aktivitasSBR = this.dataKegiatan.data_sbr.aktivitas_perusahaan;
                for (let i = 0; i < aktivitasSBR.length; i++) {
                    tempDataAktivitas.push({
                        'id': aktivitasSBR[i]['id'],
                        'status': 'SAVED',
                        'orisumber': 'sbr',
                        'tpsumber': 'sbr',
                        'sumber': 'Data SBR',
                        'aktivitas': aktivitasSBR[i]['aktivitas'],
                        'jenis': aktivitasSBR[i]['jenis'],
                        'kategori': aktivitasSBR[i]['kategori'],
                        'kbli': aktivitasSBR[i]['kbli'],
                        'perusahaan_id': aktivitasSBR[i]['perusahaan_id']
                    })
                    this.prid = aktivitasSBR[i]['perusahaan_id']
                }
                this.dataAssessmentAktivitas = tempDataAktivitas
                

                let dataAssessment = this.dataKegiatan.data_assessment;
                let tempAssessmentArr = [];
                for (let i = 0; i < dataAssessment.length; i++) {
                    if (dataAssessment[i]['aktivitas_perusahaan'] == null && dataAssessment[i][
                            'kategori_aktivitas_perusahaan'
                        ] == null && dataAssessment[i]['kbli_aktivitas_perusahaan']) continue;
                    let tempAssObj = {
                        'key': i.toString(),
                        'data': {
                            'name': dataAssessment[i]['sumber_data'] + '-' + (i + 1),
                            'type': 'button',
                            'value': null
                        },
                        'children': [{
                                'key': i + '-0',
                                'data': {
                                    'name': 'Aktivitas',
                                    'type': 'text',
                                    'value': dataAssessment[i]['aktivitas_perusahaan']
                                }
                            },
                            {
                                'key': i + '-1',
                                'data': {
                                    'name': 'Jenis',
                                    'type': 'text',
                                    'value': '-'
                                }
                            },
                            {
                                'key': i + '-2',
                                'data': {
                                    'name': 'Kategori',
                                    'type': 'text',
                                    'value': dataAssessment[i][
                                        'kategori_aktivitas_perusahaan'
                                    ]
                                }
                            },
                            {
                                'key': i + '-3',
                                'data': {
                                    'name': 'KBLI',
                                    'type': 'text',
                                    'value': dataAssessment[i][
                                        'kbli_aktivitas_perusahaan'
                                    ]
                                }
                            }
                        ],
                    }
                    tempAssessmentArr.push(tempAssObj)
                }

                this.tempDataAssessmentAktivitas = tempAssessmentArr
            },
            assigningVariableProduk() {
                let tempDataProduk = [];
                let produkSBR = this.dataKegiatan.data_sbr.produk_perusahaan;

                for (let i = 0; i < produkSBR.length; i++) {
                    tempDataProduk.push({
                        'id': produkSBR[i]['id'],
                        'status': 'SAVED',
                        'orisumber': 'sbr',
                        'tpsumber': 'sbr',
                        'sumber': 'Data SBR',
                        'produk': produkSBR[i]['produk'],
                        'kbki': produkSBR[i]['kbki'],
                        'perusahaan_id': produkSBR[i]['perusahaan_id']
                    })
                }
                this.dataAssessmentProduk = tempDataProduk

                let dataAssessment = this.dataKegiatan.data_assessment;
                let tempAssessmentArr = [];
                for (let i = 0; i < dataAssessment.length; i++) {
                    if (dataAssessment[i]['produk_perusahaan'] == null) continue;
                    let tempAssObj = {
                        'key': i.toString(),
                        'data': {
                            'name': dataAssessment[i]['sumber_data'] + '-' + (i + 1),
                            'type': 'button',
                            'value': null
                        },
                        'children': [{
                                'key': i + '-0',
                                'data': {
                                    'name': 'Produk',
                                    'type': 'text',
                                    'value': dataAssessment[i]['produk_perusahaan']
                                }
                            },
                            {
                                'key': i + '-1',
                                'data': {
                                    'name': 'KBKI',
                                    'type': 'text',
                                    'value': dataAssessment[i]['kbki_produk_perusahaan']
                                }
                            },
                        ],
                    }
                    tempAssessmentArr.push(tempAssObj)
                }

                this.tempDataAssessmentProduk = tempAssessmentArr
            },
            assigningVariableSaham() {
                let tempDataSaham = [];
                let sahamSBR = this.dataKegiatan.data_sbr.pemegang_saham;

                for (let i = 0; i < sahamSBR.length; i++) {
                    tempDataSaham.push({
                        'id': sahamSBR[i]['id'],
                        'status': 'SAVED',
                        'orisumber': 'sbr',
                        'tpsumber': 'sbr',
                        'sumber': 'Data SBR',
                        'pemegang_saham': sahamSBR[i]['pemegang_saham'],
                        'persentase_saham': sahamSBR[i]['persentase_saham'],
                        'perusahaan_id': sahamSBR[i]['perusahaan_id']
                    })
                }
                this.dataAssessmentSaham = tempDataSaham

                let dataAssessment = this.dataKegiatan.data_assessment;
                let tempAssessmentArr = [];
                for (let i = 0; i < dataAssessment.length; i++) {
                    if (dataAssessment[i]['pemegang_saham'] == null && dataAssessment[i]['persentase_saham'] == null)
                        continue;
                    let tempAssObj = {
                        'key': i.toString(),
                        'data': {
                            'name': dataAssessment[i]['sumber_data'] + '-' + (i + 1),
                            'type': 'button',
                            'value': null
                        },
                        'children': [{
                                'key': i + '-0',
                                'data': {
                                    'name': 'Pemegang Saham',
                                    'type': 'text',
                                    'value': dataAssessment[i]['pemegang_saham']
                                }
                            },
                            {
                                'key': i + '-1',
                                'data': {
                                    'name': 'Persentase Saham',
                                    'type': 'text',
                                    'value': dataAssessment[i]['persentase_saham']
                                }
                            },
                        ],
                    }
                    tempAssessmentArr.push(tempAssObj)
                }

                this.tempDataAssessmentSaham = tempAssessmentArr

            },
            assigningVariableEmail() {
                let tempDataEmail = [];
                let emailSBR = this.dataKegiatan.data_sbr.alamat_email_perusahaan;

                for (let i = 0; i < emailSBR.length; i++) {
                    tempDataEmail.push({
                        'id': emailSBR[i]['id'],
                        'status': 'SAVED',
                        'orisumber': 'sbr',
                        'tpsumber': 'sbr',
                        'sumber': 'Data SBR',
                        'email': emailSBR[i]['email'],
                        'perusahaan_id': emailSBR[i]['perusahaan_id']
                    })
                }
                this.dataAssessmentEmail = tempDataEmail

                let dataAssessment = this.dataKegiatan.data_assessment;
                let tempAssessmentArr = [];
                for (let i = 0; i < dataAssessment.length; i++) {
                    if (dataAssessment[i]['alamat_email_perusahaan'] == null) continue;
                    let tempAssObj = {
                        'key': i.toString(),
                        'data': {
                            'name': dataAssessment[i]['sumber_data'] + '-' + (i + 1),
                            'type': 'button',
                            'value': null
                        },
                        'children': [{
                            'key': i + '-0',
                            'data': {
                                'name': 'Email',
                                'type': 'text',
                                'value': dataAssessment[i]['alamat_email_perusahaan']
                            }
                        }, ],
                    }
                    tempAssessmentArr.push(tempAssObj)
                }

                this.tempDataAssessmentEmail = tempAssessmentArr
            },
            assigningVariableFax() {
                let tempDataFax = [];
                let faxSBR = this.dataKegiatan.data_sbr.alamat_fax_perusahaan;

                for (let i = 0; i < faxSBR.length; i++) {
                    tempDataFax.push({
                        'id': faxSBR[i]['id'],
                        'status': 'SAVED',
                        'orisumber': 'sbr',
                        'tpsumber': 'sbr',
                        'sumber': 'Data SBR',
                        'nomor_faksimili': faxSBR[i]['nomor_faksimili'],
                        'perusahaan_id': faxSBR[i]['perusahaan_id']
                    })
                }
                this.dataAssessmentFax = tempDataFax

                let dataAssessment = this.dataKegiatan.data_assessment;
                let tempAssessmentArr = [];
                for (let i = 0; i < dataAssessment.length; i++) {
                    if (dataAssessment[i]['alamat_fax_perusahaan'] == null) continue;
                    let tempAssObj = {
                        'key': i.toString(),
                        'data': {
                            'name': dataAssessment[i]['sumber_data'] + '-' + (i + 1),
                            'type': 'button',
                            'value': null
                        },
                        'children': [{
                            'key': i + '-0',
                            'data': {
                                'name': 'Fax',
                                'type': 'text',
                                'value': dataAssessment[i]['alamat_fax_perusahaan']
                            }
                        }, ],
                    }
                    tempAssessmentArr.push(tempAssObj)
                }

                this.tempDataAssessmentFax = tempAssessmentArr
            },
            assigningVariableTelepon() {
                let tempDataTelepon = [];
                let teleponSBR = this.dataKegiatan.data_sbr.alamat_telepon_perusahaan;

                for (let i = 0; i < teleponSBR.length; i++) {
                    tempDataTelepon.push({
                        'id': teleponSBR[i]['id'],
                        'status': 'SAVED',
                        'orisumber': 'sbr',
                        'tpsumber': 'sbr',
                        'sumber': 'Data SBR',
                        'nomor_ekstensi': teleponSBR[i]['nomor_ekstensi'],
                        'nomor_telepon': teleponSBR[i]['nomor_telepon'],
                        'perusahaan_id': teleponSBR[i]['perusahaan_id']
                    })
                }
                this.dataAssessmentTelepon = tempDataTelepon

                let dataAssessment = this.dataKegiatan.data_assessment;
                let tempAssessmentArr = [];
                for (let i = 0; i < dataAssessment.length; i++) {
                    if (dataAssessment[i]['alamat_telepon_perusahaan'] == null) continue;
                    let tempAssObj = {
                        'key': i.toString(),
                        'data': {
                            'name': dataAssessment[i]['sumber_data'] + '-' + (i + 1),
                            'type': 'button',
                            'value': null
                        },
                        'children': [{
                            'key': i + '-0',
                            'data': {
                                'name': 'Telepon',
                                'type': 'text',
                                'value': dataAssessment[i]['alamat_telepon_perusahaan']
                            }
                        }, ],
                    }
                    tempAssessmentArr.push(tempAssObj)
                }

                this.tempDataAssessmentTelepon = tempAssessmentArr
            },
            assigningVariableWeb() {
                let tempDataWeb = [];
                let webSBR = this.dataKegiatan.data_sbr.alamat_web_perusahaan;

                for (let i = 0; i < webSBR.length; i++) {
                    tempDataWeb.push({
                        'id': webSBR[i]['id'],
                        'status': 'SAVED',
                        'orisumber': 'sbr',
                        'tpsumber': 'sbr',
                        'sumber': 'Data SBR',
                        'website': webSBR[i]['website'],
                        'perusahaan_id': webSBR[i]['perusahaan_id']
                    })
                }
                this.dataAssessmentWeb = tempDataWeb

                let dataAssessment = this.dataKegiatan.data_assessment;
                let tempAssessmentArr = [];
                for (let i = 0; i < dataAssessment.length; i++) {
                    if (dataAssessment[i]['alamat_web_perusahaan'] == null) continue;
                    let tempAssObj = {
                        'key': i.toString(),
                        'data': {
                            'name': dataAssessment[i]['sumber_data'] + '-' + (i + 1),
                            'type': 'button',
                            'value': null
                        },
                        'children': [{
                            'key': i + '-0',
                            'data': {
                                'name': 'Website',
                                'type': 'text',
                                'value': dataAssessment[i]['alamat_web_perusahaan']
                            }
                        }, ],
                    }
                    tempAssessmentArr.push(tempAssObj)
                }

                this.tempDataAssessmentWeb = tempAssessmentArr
            },
            assigningVariableKontak() {
                let tempDataKontak = [];
                let kontakSBR = this.dataKegiatan.data_sbr.kontak_perusahaan;

                for (let i = 0; i < kontakSBR.length; i++) {
                    tempDataKontak.push({
                        'id': kontakSBR[i]['id'],
                        'status': 'SAVED',
                        'orisumber': 'sbr',
                        'tpsumber': 'sbr',
                        'sumber': 'Data SBR',
                        'email': kontakSBR[i]['email'],
                        'nama': kontakSBR[i]['nama'],
                        'nomor_telepon': kontakSBR[i]['nomor_telepon'],
                        'perusahaan_id': kontakSBR[i]['perusahaan_id']
                    })
                }
                this.dataAssessmentKontak = tempDataKontak

                let dataAssessment = this.dataKegiatan.data_assessment;
                let tempAssessmentArr = [];
                for (let i = 0; i < dataAssessment.length; i++) {
                    if (dataAssessment[i]['kontak_perusahaan_nama'] == null && dataAssessment[i][
                            'kontak_perusahaan_email'
                        ] == null && dataAssessment[i]['kontak_perusahaan_nomor_telepon'] == null) continue;
                    let tempAssObj = {
                        'key': i.toString(),
                        'data': {
                            'name': dataAssessment[i]['sumber_data'] + '-' + (i + 1),
                            'type': 'button',
                            'value': null
                        },
                        'children': [{
                                'key': i + '-0',
                                'data': {
                                    'name': 'Nama CP',
                                    'type': 'text',
                                    'value': dataAssessment[i]['kontak_perusahaan_nama']
                                }
                            },
                            {
                                'key': i + '-1',
                                'data': {
                                    'name': 'Email CP',
                                    'type': 'text',
                                    'value': dataAssessment[i]['kontak_perusahaan_email']
                                }
                            },
                            {
                                'key': i + '-2',
                                'data': {
                                    'name': 'No Telp CP',
                                    'type': 'text',
                                    'value': dataAssessment[i]['kontak_perusahaan_nomor_telepon']
                                }
                            },
                        ],
                    }
                    tempAssessmentArr.push(tempAssObj)
                }

                this.tempDataAssessmentKontak = tempAssessmentArr
            },
            async getData() {
                if(this.selectedKegiatan == null) {
                    this.setDefaultCon()
                    this.isIframeShow = true
                    this.isFreshLoad = false
                    return
                }
                this.onLoadData = true
                // set default condition 
                this.setDefaultCon()
                await DataService.getDataAssessment(this.selectedKegiatan.id_kegiatan, this.currentId)
                    .then(response => {
                        // loading hide
                        this.onLoadData = false

                        if (response.data.meta.status == 'success') {

                            // kalo assessment sudah selesai, stop proses.
                            if (this.isAssessmentDone(response)) return;

                            // set data kegiatan all
                            this.dataKegiatan = response.data.data

                            // assigning id_perusahaan ke data assessment
                            this.dataKegiatan.data_assessment.forEach(obj => {
                                obj.perusahaan_id = this.dataKegiatan.data_sbr.id_perusahaan
                            })
                            // update progres
                            this.progresAssessment = parseFloat(((this.dataKegiatan['summary']['sudah_assessment'] / this.dataKegiatan['summary']['total_data_assessment'])*100).toFixed(2))

                            // assign value for assessment - khusus non array variable
                            this.assigningVariableNonArray()

                            // asign value assessment - khusus aktivitas
                            this.assigningVariableAktivitas()

                            // asign value assessment - khusus produk
                            this.assigningVariableProduk()

                            // asign value assessment - khusus saham
                            this.assigningVariableSaham()

                            // asign value assessment - khusus email
                            this.assigningVariableEmail()

                            // asign value assessment - khusus fax
                            this.assigningVariableFax()

                            // asign value assessment - khusus telepon
                            this.assigningVariableTelepon()

                            // asign value assessment - khusus web
                            this.assigningVariableWeb()

                            // asign value assessment - khusus kontak perusahaan
                            this.assigningVariableKontak()

                            return;
                        }

                        this.errorHandler(response.data.meta.message)
                    })
                    .catch(error => {
                        // loading hide
                        this.onLoadData = false
                        console.log(error)
                        this.errorHandler(error.response.data.meta.message)
                    })
            },
            async getUserData($id) {
                // console.log('userid', $id)
                this.currentId = $id
                this.getData()
            },
            async getMasterData(param, param2 = null) {
                await DataService.getDataMaster(param, param2).then(response => {
                    this.masterDropdown = response.data.data
                }).catch(error => {
                    console.log(error)
                    this.errorHanlder(error.response.data.meta.message)
                })
            },
            setDefaultCon() {
                this.isIframeShow = false
                this.isFreshLoad = false
                this.errorMessages = []
                this.successMessage = null
                this.loadingDialog = false
                this.dataKegiatan = null
                this.dataAssessmentNonArray = null
                this.tempDataAssessmentAktivitas = null
                this.dataAssessmentAktivitas = null
                this.tempDataAssessmentProduk = null
                this.dataAssessmentProduk = null
                this.tempDataAssessmentSaham = null
                this.dataAssessmentSaham = null
                this.tempDataAssessmentEmail = null
                this.dataAssessmentEmail = null
                this.tempDataAssessmentFax = null
                this.dataAssessmentFax = null
                this.tempDataAssessmentTelepon = null
                this.dataAssessmentTelepon = null
                this.tempDataAssessmentWeb = null
                this.dataAssessmentWeb = null
                this.tempDataAssessmentKontak = null
                this.dataAssessmentKontak = null
            },
            errorHandler(errorMessage) {
                this.onLoadData = false
                this.dataKegiatan = null
                this.dataAssessmentNonArray = null
                this.loadingDialog = false
                this.successMessage = null
                this.errorMessages.push(errorMessage)
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error!',
                    detail: 'Ups, ada error :(',
                    life: 5000
                });

            },
            toastMessage(type, title, message) {
                this.$toast.add({
                    severity: type,
                    summary: title,
                    detail: message,
                    life: 2000
                });
            },
            editValueSelected(variable) {

                this.selectedKeyForEdit = variable
                let tempMetaVariable = this.dataAssessmentNonArray.find(meta => {
                    return meta.variable == variable
                })
                this.titleDialogEdit = tempMetaVariable == undefined ? '' : tempMetaVariable.title
                this.dialogTypeEdit = tempMetaVariable.type

                if (this.dialogTypeEdit == 'dropdown') {
                    let refMaster = tempMetaVariable.refMaster,
                        param = null;

                    if (tempMetaVariable.evfunc != null) {

                        if (refMaster == 'kabupaten-perusahaan') {
                            if (this.selectedDataNonArray['provinsi'] == null) {
                                this.toastMessage('error', 'Error!', 'Ups, Isian provinsi harus terisi dahulu! :(');
                                return;
                            }
                            param = this.selectedDataNonArray['provinsi'];
                        }

                        if (refMaster == 'kecamatan-perusahaan') {
                            if (this.selectedDataNonArray['kabupaten_kota'] == null) {
                                this.toastMessage('error', 'Error!',
                                    'Ups, Isian kabupaten/kota harus terisi dahulu! :(');
                                return;
                            }
                            param = this.selectedDataNonArray['kabupaten_kota'];
                        }

                        if (refMaster == 'desa-perusahaan') {
                            if (this.selectedDataNonArray['kecamatan'] == null) {
                                this.toastMessage('error', 'Error!', 'Ups, Isian kecamatan harus terisi dahulu! :(');
                                return;
                            }
                            param = this.selectedDataNonArray['kecamatan'];
                        }

                        this.getMasterData(tempMetaVariable.evfunc, param).then(() => {
                            this.optionEditDialog = this.masterDropdown
                        })
                    } else {
                        switch (refMaster) {
                            case 'skala-usaha':
                                this.optionEditDialog = this.masterSkalaUsaha;
                                break;
                            case 'unit-statistik':
                                this.optionEditDialog = this.masterUnitStatistik;
                                break;
                            case 'jk-pengusaha':
                                this.optionEditDialog = this.masterJkPengusaha;
                                break;
                            case 'multinational-status':
                                this.optionEditDialog = this.masterMultinationalStatus;
                                break;
                            case 'status-kepemilikan':
                                this.optionEditDialog = this.masterStatusKepemilikan;
                                break;
                            default:
                                break;
                        }
                    }

                }

                this.editedValue = this.selectedDataNonArray[variable] == null ? '' : this.selectedDataNonArray[
                    variable]
                this.displayFormEditTextAndDate = true
            },
        }
    }
</script>
<style scoped>
    ::v-deep(.p-card-body) {
        padding: 0 !important;
    }

    ::v-deep(.p-card-content) {
        padding: 0 !important;
    }

    ::v-deep(.p-dropdown:not(.p-disabled).p-focus) {
        box-shadow: none !important;
    }

    .ccm-custom {
        margin-left: 15px;
        width: calc(100% - 30px);
    }

    button.onclick-btn-custom {
        box-shadow: none !important;
    } 
    .submit-btn-matcha:hover {
        box-shadow: 0 8px 25px -8px #7367f0 !important;
    }

    ::v-deep(thead th) {
        background-color: #f3f2f7 !important;
        vertical-align: top;
        text-transform: uppercase;
        font-size: .857rem;
        letter-spacing: .5px;
        text-align: center !important;
    }

    ::v-deep(div.p-column-header-content) {
        width: 100%;
    }

    ::v-deep(span.p-column-title) {
        margin: 0 auto;
    }

    ::v-deep(.p-speeddial-button.p-button.p-button-icon-only) {
        width: 3rem;
        height: 3rem;
    }

</style>