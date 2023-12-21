package com.example.courtreservation.ui.setting

import android.content.Context
import android.content.SharedPreferences
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.courtreservation.FragmentSwitchListener
import com.example.courtreservation.MainActivity
import com.example.courtreservation.databinding.FragmentSettingBinding

class SettingFragment:Fragment() {
    private var _binding: FragmentSettingBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSettingBinding.inflate(inflater, container, false)
        val root: View = binding.root
        val switch = binding.switchExample
        val input = binding.editTextInput
        var act = activity as FragmentSwitchListener
        switch.isChecked = act.getConfig("is_open","bool","true").toBoolean()
        var ischeck = switch.isChecked
        input.hint = act.getConfig("gap","int","30")


        // 设置监听器以响应开关状态变化
        switch.setOnCheckedChangeListener { _, isChecked ->
            input.hint = act.getConfig("gap","int","30")
            ischeck = isChecked
            input.isEnabled = isChecked
        }

        binding.btn.setOnClickListener{
            act.setConfig("is_open","bool",ischeck.toString())
            if(ischeck){
                act.setConfig("gap","int",binding.editTextInput.text.toString())
            }
            Toast.makeText(this.requireContext(), "已保存", Toast.LENGTH_SHORT).show()
            act.goBack()
        }


        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}