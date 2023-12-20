package com.example.courtreservation.ui.matching_record

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.courtreservation.databinding.FragmentMatchingRecordBinding
import com.example.courtreservation.ui.login.LoginActivity

class MatchingRecordFragment: Fragment() {
    private var _binding: FragmentMatchingRecordBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        val matchingRecordViewModel = ViewModelProvider(this).get(MatchingRecordViewModel::class.java)

        _binding = FragmentMatchingRecordBinding.inflate(inflater, container, false)
        val root: View = binding.root

        // Assuming you have a LinearLayout in your FragmentMatchingRecordBinding
        val linearLayout = binding.linearLayoutForRecords

        // Fetch matching records
//        val matchingRecords = fetchMatchingRecords() // Implement this method

        // Dynamically add views based on the fetched data
//        matchingRecords.forEach { record ->
//            val textView = TextView(context).apply {
//                text = "${record.opponentName} - ${record.matchDate}: ${record.result}"
//                // Set other properties like layout parameters, text size, etc.
//            }
//            linearLayout.addView(textView)
//        }

        return root
    }

//    private fun fetchMatchingRecords(): List<MatchingRecord> {
//        // Fetch your matching records here
//        // This can be a database call, a network request, or data from ViewModel
//        // For demonstration, returning an empty list
//        return listOf()
//    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}