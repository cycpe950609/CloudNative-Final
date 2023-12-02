package com.example.courtreservation.ui.reservation_record

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.courtreservation.databinding.FragmentCourtBinding
import com.example.courtreservation.databinding.FragmentReservationRecordBinding

class ReservationRecordFragment:Fragment() {
    private var _binding: FragmentReservationRecordBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val reservationRecordViewModel =
            ViewModelProvider(this).get(ReservationRecordViewModel::class.java)

        _binding = FragmentReservationRecordBinding.inflate(inflater, container, false)
        val root: View = binding.root

        val textView: TextView = binding.textReservationRecord
        reservationRecordViewModel.text.observe(viewLifecycleOwner) {
            textView.text = it
        }
        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}