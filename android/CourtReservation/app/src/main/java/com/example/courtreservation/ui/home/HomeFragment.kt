package com.example.courtreservation.ui.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.viewpager2.widget.ViewPager2
import com.example.courtreservation.R
import com.example.courtreservation.databinding.FragmentHomeBinding
import com.example.courtreservation.FragmentSwitchListener


class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null

    private lateinit var viewPager: ViewPager2
    private lateinit var imageList: List<Int> // 你的图片资源ID列表

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {

        _binding = FragmentHomeBinding.inflate(inflater, container, false)

        //viewPager = binding.viewPager
        //imageList = listOf(R.drawable.user_selfie)


        //val adapter = ImageAdapter(imageList,activity as FragmentSwitchListener,viewPager)
        //viewPager.adapter = adapter
        var act = activity as FragmentSwitchListener

        binding.btn1.setOnClickListener {
            act.replaceFragment(R.id.nav_stadium_list)
        }

        binding.btn2.setOnClickListener {
            act.replaceFragment(R.id.nav_reservation_record)
        }

        binding.btn3.setOnClickListener {
            act.replaceFragment(R.id.nav_online_matching)
        }

        binding.btn4.setOnClickListener {
            act.replaceFragment(R.id.nav_announcement_list)
        }

        return binding.root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
