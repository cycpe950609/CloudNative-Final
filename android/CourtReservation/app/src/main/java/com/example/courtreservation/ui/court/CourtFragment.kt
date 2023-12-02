package com.example.courtreservation.ui.court

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.fragment.app.Fragment
import com.example.courtreservation.databinding.FragmentCourtBinding

class CourtFragment:Fragment() {
    private var _binding: FragmentCourtBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentCourtBinding.inflate(inflater, container, false)
        val root: View = binding.root
        //val map :ImageView = binding.imageView

        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}