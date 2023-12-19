package com.example.courtreservation.ui.court

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.fragment.app.Fragment
import com.example.courtreservation.MainActivity
import com.example.courtreservation.R
import com.example.courtreservation.databinding.FragmentCourtBinding
import com.example.courtreservation.ui.court_info.CourtInformationFragment
import com.example.courtreservation.ui.home.FragmentSwitchListener
import com.example.courtreservation.ui.map.MapFragment

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
        var act = activity as FragmentSwitchListener
        //val map :ImageView = binding.imageView
        var btn_showmap = binding.btn1

        btn_showmap.setOnClickListener{
            act.replaceFragment(R.id.nav_map,0)
        }

        var btn_stadiumInfo = binding.btn2

        btn_stadiumInfo.setOnClickListener{
            act.replaceFragment(R.id.nav_court_info,0)
        }

        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}