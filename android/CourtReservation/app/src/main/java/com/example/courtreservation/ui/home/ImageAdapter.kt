package com.example.courtreservation.ui.home

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.RecyclerView
import androidx.viewpager2.widget.ViewPager2
import com.example.courtreservation.R
import com.example.courtreservation.ui.announcement.AnnouncementFragment

class ImageAdapter(private val imageList: List<Int>,private val listener:FragmentSwitchListener, private val viewPager:ViewPager2) : RecyclerView.Adapter<ImageViewHolder>() {

    companion object {
        fun newInstance(someData: Int): AnnouncementFragment {
            val fragment = AnnouncementFragment()
            val args = Bundle()
            args.putInt("ImageID", someData)
            fragment.arguments = args
            return fragment
        }
    }
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ImageViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.fragment_image, parent, false)

        return ImageViewHolder(view)
    }

    override fun onBindViewHolder(holder: ImageViewHolder, position: Int) {
        val imageResource = imageList[position]
        holder.imageView.setImageResource(imageResource)

        holder.imageView.setOnClickListener{
            listener.replaceFragment(newInstance(position) as Fragment)
        }
    }

    override fun getItemCount(): Int {
        return imageList.size
    }

}

class ImageViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
    val imageView: ImageView = itemView.findViewById(R.id.imageView)

}