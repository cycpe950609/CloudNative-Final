package com.example.courtreservation

import androidx.fragment.app.Fragment
import androidx.navigation.NavArgs

interface FragmentSwitchListener {
    fun replaceFragment(fragId: Int)
    fun replaceFragmentWithArgs(fragId: Int,args:String)
    fun goBack()

    fun setFragmentLabel(label:String)

}