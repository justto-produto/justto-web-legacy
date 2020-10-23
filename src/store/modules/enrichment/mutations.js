import { Lawyer } from '@/models/enrichment/Lawyer.model'
import Vue from 'vue'

export default {
  setSearchedLawyers: (state, searchedLawyers) => {
    const lawyers = searchedLawyers.map(lawyer => new Lawyer(lawyer))
    Vue.set(state, 'searchedLawyers', [...lawyers])
    state.searchLawyersLoading = false
  },
  startSearchLawyerLoading: (state) => {
    state.searchLawyersLoading = true
  },
  cleanSearchedLawyers: state => { state.searchedLawyers = [] }
}
