package com.example.courtreservation.ui.online_matching

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.courtreservation.databinding.FragmentOnlineMatchingBinding

class OnlineMatchingFragment:Fragment() {
    private var _binding: FragmentOnlineMatchingBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val onlineMatchingViewModel =
            ViewModelProvider(this).get(OnlineMatchingViewModel::class.java)

        _binding = FragmentOnlineMatchingBinding.inflate(inflater, container, false)
        val root: View = binding.root

        val textView: TextView = binding.textOnlineMatching
        onlineMatchingViewModel.text.observe(viewLifecycleOwner) {
            textView.text = it
        }
        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}