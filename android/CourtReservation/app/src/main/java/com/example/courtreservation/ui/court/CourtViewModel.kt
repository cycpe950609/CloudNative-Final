package com.example.courtreservation.ui.court

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class CourtViewModel:ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        value = "This is court Fragment"
    }
    val text: LiveData<String> = _text
}