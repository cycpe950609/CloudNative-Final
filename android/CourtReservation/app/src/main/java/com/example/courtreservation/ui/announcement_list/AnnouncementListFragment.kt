package com.example.courtreservation.ui.announcement_list

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.example.courtreservation.databinding.FragmentAnnouncementListBinding

class AnnouncementListFragment:Fragment() {
    private var _binding: FragmentAnnouncementListBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentAnnouncementListBinding.inflate(inflater, container, false)

        return binding?.root
    }

}