package com.example.courtreservation.ui.announcement

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.example.courtreservation.MainActivity
import com.example.courtreservation.R
import com.example.courtreservation.databinding.FragmentAnnouncementBinding
import com.example.courtreservation.FragmentSwitchListener


class AnnouncementFragment: Fragment() {
    private var _binding: FragmentAnnouncementBinding? = null
    private val binding get() = _binding!!

    @SuppressLint("RestrictedApi")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        super.onCreate(savedInstanceState)

        _binding = FragmentAnnouncementBinding.inflate(layoutInflater)
        val root = binding.root

        var ImageId : Int? = arguments?.getInt("ImageID")

        var Linearlayout = binding.announceBoard

        val imageView = binding.bulletImage
        if ( ImageId == 0){
            imageView.setImageResource(R.drawable.group_photo)
        }

        var act = activity as MainActivity
        var announcement = act.anno?.get(0)

        // 創建一個 TextView
        val textView = binding.bulletText
        textView.text = announcement?.content

        val backbtn = binding.btnBack
        backbtn.setOnClickListener{
            onBackPressed()
        }

        return root

    }
    private fun onBackPressed() {
        var main_activity = activity as FragmentSwitchListener
        main_activity.goBack()
    }
}


