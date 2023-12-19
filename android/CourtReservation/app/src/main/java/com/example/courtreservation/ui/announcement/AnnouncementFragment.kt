package com.example.courtreservation.ui.announcement

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.example.courtreservation.R
import com.example.courtreservation.databinding.FragmentAnnouncementBinding


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

        val imageView = binding.bulleImage
        if ( ImageId == 0){
            imageView.setImageResource(R.drawable.group_photo)
        }
        else if (ImageId == 1){
            imageView.setImageResource(R.drawable.image2)
        }
        else if (ImageId == 2){
            imageView.setImageResource(R.drawable.image3)
        }

        // 創建一個 TextView
        val textView = binding.bulleText
        textView.text = "你的文字" + ImageId.toString()

        return root

    }

}


