package com.example.courtreservation.ui.matching_record

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class MatchingRecordViewModel:ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        value = "This is matching-record Fragment"
    }
    val text: LiveData<String> = _text
}