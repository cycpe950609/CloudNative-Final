package com.example.courtreservation.ui.court_reservation

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.courtreservation.databinding.FragmentCourtReservationBinding

class CourtReservationFragment:Fragment() {
    private var _binding: FragmentCourtReservationBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val courtReservationViewModel =
            ViewModelProvider(this).get(CourtReservationViewModel::class.java)

        _binding = FragmentCourtReservationBinding.inflate(inflater, container, false)
        val root: View = binding.root

        val textView: TextView = binding.textCourtReservation
        courtReservationViewModel.text.observe(viewLifecycleOwner) {
            textView.text = it
        }
        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}