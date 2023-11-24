package com.example.courtreservation.ui.reservation_record

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class ReservationRecordViewModel:ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        value = "This is reservation-record Fragment"
    }
    val text: LiveData<String> = _text
}