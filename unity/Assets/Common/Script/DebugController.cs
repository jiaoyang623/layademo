using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;

public class DebugController : MonoBehaviour
{
    public TextMeshProUGUI text;
    private float time = 0;
    private int count = 0;

    void Start()
    {
        time = Time.time;
    }

    // Update is called once per frame
    void Update()
    {
        if (Time.time - time >= 1)
        {
            text.text = $"FPS: {count}";
            count = 0;
            time = Time.time;
        }

        count++;
    }
}