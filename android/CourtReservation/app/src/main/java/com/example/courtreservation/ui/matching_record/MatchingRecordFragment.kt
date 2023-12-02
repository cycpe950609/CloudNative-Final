package com.example.courtreservation.ui.matching_record

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.courtreservation.databinding.FragmentMatchingRecordBinding

class MatchingRecordFragment:Fragment() {
    private var _binding: FragmentMatchingRecordBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val matchingRecordViewModel =
            ViewModelProvider(this).get(MatchingRecordViewModel::class.java)

        _binding = FragmentMatchingRecordBinding.inflate(inflater, container, false)
        val root: View = binding.root

        val textView: TextView = binding.textMatchingRecord
        matchingRecordViewModel.text.observe(viewLifecycleOwner) {
            textView.text = it
        }
        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}