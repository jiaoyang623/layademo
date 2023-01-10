using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour
{
    private CharacterController controller;
    public GameObject holder;
    public GameObject innerCamera;
    public float moveSpeed = 5f;
    public float rotateSpeed = 100f;
    private bool isLocked = false;

    void Start()
    {
        innerCamera.transform.localPosition = new Vector3(0, 0, 0);
        controller = holder.GetComponent<CharacterController>();
    }

    void Update()
    {
        LockCursor();
        if (isLocked)
        {
            MoveCamera();
        }
    }

    private void MoveCamera()
    {
        var h = Input.GetAxisRaw("Horizontal");
        var v = Input.GetAxisRaw("Vertical");
        var vec = holder.transform.right * h * moveSpeed * Time.deltaTime
                  + holder.transform.forward * v * moveSpeed * Time.deltaTime;
        controller.Move(vec);
        // controller.Move(new Vector3(h * moveSpeed * Time.deltaTime, 0, v * moveSpeed * Time.deltaTime));
        var x = Input.GetAxisRaw("Mouse X");
        var y = Input.GetAxisRaw("Mouse Y");
        innerCamera.transform.Rotate(new Vector3(-y * rotateSpeed * Time.deltaTime, 0, 0));
        holder.transform.Rotate(new Vector3(0, x * rotateSpeed * Time.deltaTime, 0));
        Debug.Log($"CC {h},{v} {x},{y}");
    }

    private void LockCursor()
    {
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            isLocked = false;
            Cursor.lockState = CursorLockMode.None;
        }
        else if (Input.GetAxisRaw("Fire1") == 1)
        {
            isLocked = true;
            Cursor.lockState = CursorLockMode.Locked;
        }
    }
}