package com.example.courtreservation.ui.online_matching

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class OnlineMatchingViewModel:ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        value = "This is online-matching Fragment"
    }
    val text: LiveData<String> = _text
}