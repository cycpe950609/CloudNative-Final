package com.example.courtreservation.ui.court_reservation

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class CourtReservationViewModel:ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        value = "This is court-reservation Fragment"
    }
    val text: LiveData<String> = _text
}