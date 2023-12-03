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
        var bt1 = binding.findFriendBtn1
        bt1.setOnClickListener {
            bt1click(view)
        }
        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
    private fun bt1click(view: View?) {
        val txtName: TextView = binding.txtName
        val txtAge: TextView = binding.txtAge
        val txtGender: TextView = binding.txtGender
        val txtName1: TextView = binding.nameOut1
        val txtName2: TextView = binding.nameOut2
        val txtName3: TextView = binding.nameOut3
        val txtName4: TextView = binding.ageOut4
        val txtAge1: TextView = binding.ageOut1
        val txtAge2: TextView = binding.ageOut2
        val txtAge3: TextView = binding.ageOut3
        val txtAge4: TextView = binding.ageOut4
        val txtGender1: TextView = binding.genderOut1
        val txtGender2: TextView = binding.genderOut2
        val txtGender3: TextView = binding.genderOut3
        val txtGender4: TextView = binding.genderOut4
        txtName.visibility = View.VISIBLE
        txtAge.visibility = View.VISIBLE
        txtGender.visibility = View.VISIBLE
        txtName1.visibility = View.VISIBLE
        txtName2.visibility = View.VISIBLE
        txtName3.visibility = View.VISIBLE
        txtName4.visibility = View.VISIBLE
        txtAge1.visibility = View.VISIBLE
        txtAge2.visibility = View.VISIBLE
        txtAge3.visibility = View.VISIBLE
        txtAge4.visibility = View.VISIBLE
        txtGender1.visibility = View.VISIBLE
        txtGender2.visibility = View.VISIBLE
        txtGender3.visibility = View.VISIBLE
        txtGender4.visibility = View.VISIBLE
    }
}