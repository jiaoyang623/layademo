@echo off
rm -rf Assets Library scene.ls
mv ./LayaScene_SampleScene/Conventional/* ./
rm -rf LayaScene_SampleScene
mv SampleScene.ls scene.ls
