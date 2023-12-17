package com.example.courtreservation.ui.home

import androidx.fragment.app.Fragment
import androidx.navigation.NavArgs

interface FragmentSwitchListener {
    fun replaceFragment(fragId: Int, args: Int)
    fun goBack()

}