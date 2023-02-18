import axios from 'axios'

// const apiClient = axios.create({
//   baseURL: 'https://my-json-server.typicode.com/imamsatya/testdb2',
//   withCredentials: false,
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Origin': '*'
//   },
//   maxContentLength: Infinity,
//   maxBodyLength: Infinity
// })

// https://matcha-dev.bps.go.id/matcha-backend


// const apiClientSbr = axios.create({
//   baseURL: process.env.VUE_APP_BACKEND_URL,
//   // baseURL: "https://matcha-dev.bps.go.id/matcha-backend",
//   withCredentials: false,
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Origin': '*'
//   },
//   maxContentLength: Infinity,
//   maxBodyLength: Infinity
// })
// const baseURL = process.env.VUE_APP_BACKEND_URL
axios.defaults.baseURL = process.env.VUE_APP_BACKEND_URL;

export default {

//Authentication
  login(authData){
    return axios.post('/api/login', authData)
    // return apiClientSbr.post('/api/login', authData)
  }, 
  getCurrentUser(){
    return axios.get('/api/users/current')
    // return apiClientSbr.get('/api/users/current')
  },

//User
addNewUser($data){
  return axios.post('/api/users', $data)
},
updateUser($iduser, $data) {
  return axios.put('/api/users/'+$iduser, $data)
},
deleteUser($iduser) {
  return axios.delete('/api/users/'+$iduser)
},
updatePasswordUser($iduser, $data) {
  return axios.put('/api/users/'+$iduser+'/security', $data)
},

//Assessment
  getDataAssessment($idKegiatan, $idUser){
    return axios.get('/api/kegiatan/'+$idKegiatan+'/assessment/users/'+$idUser)
    // return apiClientSbr.get('/api/kegiatan/'+$idKegiatan+'/assessment/users/'+$idUser)
  },
  postDataAssessment($data, $idKegiatan, $idUser){
    // return apiClientSbr.post('/api/kegiatan/'+$idKegiatan+'/assessment/users/'+$idUser, $data)
    return axios.post('/api/kegiatan/'+$idKegiatan+'/assessment/users/'+$idUser, $data)
  },

  //Get Kegiatan Aktif
  getKegiatanActiveMatching(){
    // return apiClientSbr.get('/api/kegiatan?type=matching&status=active')
    return axios.get('/api/kegiatan?type=matching&status=active')
  },
  getKegiatanActiveAssessment(){
    return axios.get('/api/kegiatan?type=assessment&status=active')
  },
  getKegiatanActiveMatchingAssessment($tipeKegiatan){
    return axios.get('/api/kegiatan?type='+$tipeKegiatan+'&status=active')
  },
  getKegiatanFilter(tipe, status){
    return axios.get(`/api/kegiatan?type=${tipe}&status=${status}`)
  },

//Matching
  getDataMatching($id_kegiatan, $idUser){
    return axios.get('/api/kegiatan/'+$id_kegiatan+'/matching/users/'+$idUser)
  },
  postDataMatching($id_kegiatan, $idUser, $data){
    return axios.post('/api/kegiatan/'+$id_kegiatan+'/matching/users/'+$idUser, $data)
  },


  getAllUsers(){
    return axios.get('/api/users')
  },
  getUsers(){
    return axios.get('/api/users?role=user')
  },
  getKegiatanActive(){
    return axios.get('/api/kegiatan?status=active')
  },
  getKegiatanData($id){
    return axios.get('/api/kegiatan/'+$id+'/dashboard/admin')
  },
  getKegiatanDataUser($id, $year){
    return axios.get('/api/users/'+$id+'/dashboard?year='+$year)
  },


  //Kegiatan
  getAllKegiatan(){
    return axios.get('/api/kegiatan')
  },
  postKegiatan($data){
    return axios.post('/api/kegiatan', $data)
  },
  updateKegiatan($id, $data){
    return axios.put('/api/kegiatan/'+$id, $data)
  },
  deleteKegiatan($id, $data){
    return axios.delete('/api/kegiatan/'+$id, $data)

  },


  //Alokasi Efisien
  getUsersKegiatan($id, $tipeAlokasi){
    return axios.get('/api/kegiatan/'+$id+'/'+$tipeAlokasi+'/alokasi')
  },
  submitAlokasi($id, $tipeAlokasi, $data){
    return axios.post('/api/kegiatan/'+$id+'/'+$tipeAlokasi+'/alokasi', $data)
  },
  deleteAlokasi($idKegiatan, $tipeAlokasi, $idUser){
    return axios.delete('/api/kegiatan/'+$idKegiatan+'/'+$tipeAlokasi+'/alokasi/users/'+$idUser)
  },

  // Master  
  getDataMaster(param, param2 = null) {
    switch(param) {
      case 'jaringan-usaha':
        return axios.get('/api/master/jaringan-usaha');
      case 'badan-hukum':
        return axios.get('/api/master/badan-hukum');
      case 'negara': 
        return axios.get('/api/master/negara');
      case 'jenis-wp':
        return axios.get('/api/master/jeniswp');
      case 'skala-wp':
        return axios.get('/api/master/skalawp');
      case 'status-wp':
        return axios.get('/api/master/statuswp');
      case 'sektor-institusi':
        return axios.get('/api/master/sektor-institusi')
      case 'status-perusahaan':
        return axios.get('/api/master/status-perusahaan');
      case 'provinsi': 
        return axios.get('/api/master/provinsi');
      case 'kabupaten':
        return axios.get('/api/master/kabupaten-kota?nama='+param2);
      case 'kecamatan':
        return axios.get('/api/master/kecamatan?nama='+param2);
      case 'desa':
        return axios.get('/api/master/desa?nama='+param2);
      default:
        break;
    }
  }, 

  /**
   * 
   * @param {*} $iduser 
   * @param {*} $status -> inactive, active, done
   * @returns 
   */  
  getDaftarKegiatanMatchingUser($iduser, $status='') {
    return axios.get('/api/users/'+$iduser+'/matching?status='+$status)    
  },

  /**
   * 
   * @param {*} $iduser 
   * @param {*} $status -> inactive, active, done
   * @returns 
   */  
   getDaftarKegiatanAssessmentUser($iduser, $status='') {
    return axios.get('/api/users/'+$iduser+'/assessment?status='+$status)    
  },

  getReportMatchingUser($iduser, $idkegiatan, $typeReport) {    
    return axios.get('/api/users/'+$iduser+'/report/'+$typeReport+'/'+$idkegiatan)
  },

  getDataUserFromSSO(token) {
    return axios.get(
      'https://sso.bps.go.id/auth/realms/pegawai-bps/account',                    
      {
        headers: {   
              'Accept': 'application/json',
              'Authorization': 'Bearer '+token
          }
      }
    );
  },

  getTokenMatchaAfterSSO(username) {
    return axios.post('/api/after-sso', {username: username})
  },

  getResumeUnitStatistik() {
    return axios.get('/api/analytics/unit-statistik')
  },

  getConfigSSO() {
    return axios.get('/api/config/sso')
  },

  getResumeStatusAktif() {
    return axios.get('/api/analytics/status-aktif')
  },

  getResumeByProvinsi() {
    return axios.get('/api/analytics/usaha-by-provinsi')
  },

  getResumeSektorInstitusi() {
    return axios.get('/api/analytics/sektor-institusi')
  },

  getResumeBadanUsaha() {
    return axios.get('/api/analytics/badan-usaha')
  },

  getResumeJaringanUsaha() {
    return axios.get('/api/analytics/jaringan-usaha')
  },

  getResumeSkalaUsaha() {
    return axios.get('/api/analytics/skala-usaha')
  },

  getResumeByKategoriKBLI() {
    return axios.get('/api/analytics/usaha-by-kategori-kbli')
  },

  getResumeVariabelEsensial() {
    return axios.get('/api/analytics/variabel-esensial')
  },

  postIgnoreData(id_kegiatan, iduser, data) {
    return axios.post('/api/kegiatan/'+id_kegiatan+'/matching/users/'+iduser+'/ignore-data', data)
  },

  getMatchingResultsUser(idkegiatan, iduser) {
    return axios.get('/api/kegiatan/'+idkegiatan+'/matching/users/'+iduser+'/matching-results')
  },

  getDetailMatchingResultsUser(idkegiatan, iduser, idspool) {
    return axios.get('/api/kegiatan/'+idkegiatan+'/matching/users/'+iduser+'/matching-results/'+idspool)
  },
  cancelMatchingResult(idspool, idsbr, idkegiatan, iduser) {
    if(idsbr) {
      return axios.post('/api/kegiatan/'+idkegiatan+'/matching/users/'+iduser+'/matching-results/cancel/'+idspool+'/'+idsbr)
    }
    return axios.post('/api/kegiatan/'+idkegiatan+'/matching/users/'+iduser+'/matching-results/cancel/'+idspool)
  },
  cancelAllMatching(idspool, idkegiatan, iduser) {
    return axios.post('/api/kegiatan/'+idkegiatan+'/matching/users/'+iduser+'/matching-results/cancel-all/'+idspool)
  }
  

}
