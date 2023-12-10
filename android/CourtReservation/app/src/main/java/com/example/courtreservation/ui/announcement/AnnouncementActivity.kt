package com.example.courtreservation.ui.announcement

import android.annotation.SuppressLint
import android.os.Bundle
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.courtreservation.R
import com.example.courtreservation.databinding.ActivityAnnouncementBinding
import com.google.android.material.internal.ViewUtils.dpToPx





class AnnouncementActivity: AppCompatActivity() {
    private lateinit var binding: ActivityAnnouncementBinding

    @SuppressLint("RestrictedApi")
    override fun onCreate(savedInstanceState: Bundle?){
        super.onCreate(savedInstanceState)

        binding = ActivityAnnouncementBinding.inflate(layoutInflater)
        supportActionBar?.hide()
        setContentView(binding.root)

        var Linearlayout = binding.announceBoard

        val imageView = ImageView(this)
        val params = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.MATCH_PARENT
        ).apply {
            // 设置边距，例如设置所有边距为 16dp
            val marginInPixels = dpToPx(this@AnnouncementActivity,10) // 将 dp 转换为像素
            setMargins(marginInPixels.toInt(),
                marginInPixels.toInt(), marginInPixels.toInt(), marginInPixels.toInt()
            )
        }
        imageView.layoutParams = params
        imageView.setImageResource(R.drawable.image2)

        // 創建一個 TextView
        val textView = TextView(this)
        textView.layoutParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        )
        textView.text = "你的文字"

        Linearlayout.addView(imageView)
        Linearlayout.addView(textView)

    }

}