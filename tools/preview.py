#!/usr/bin/env python3
"""Debug preview: splat 66k surface points with the projected clay tones from 3 yaw angles."""
import json, pathlib, cv2, numpy as np, trimesh
ROOT = pathlib.Path(__file__).resolve().parent.parent
m = trimesh.load(ROOT/'public/models/my-portrait.glb', force='mesh')
meta = json.load(open(ROOT/'src/data/portrait-meta.json'))
pts, fi = trimesh.sample.sample_surface(m, 400000); nrm = m.face_normals[fi]
ft = cv2.imread(str(ROOT/'public/textures/front-tone.jpg'), 0)/255.; st = cv2.imread(str(ROOT/'public/textures/side-tone.jpg'), 0)/255.
def samp(img,u,v):
    h,w=img.shape; return img[np.clip((v*(h-1)).astype(int),0,h-1), np.clip((u*(w-1)).astype(int),0,w-1)]
v=(meta['yTop']-pts[:,1])/(meta['yTop']-meta['yBottom'])
uf=(pts[:,0]-meta['front']['xMin'])/(meta['front']['xMax']-meta['front']['xMin'])
us=(meta['side']['zNear']-pts[:,2])/(meta['side']['zNear']-meta['side']['zFar'])
wf=np.clip(nrm[:,2],0,1)**2; ws=nrm[:,0]**2+np.clip(-nrm[:,2],0,1)**2
tone=(wf*samp(ft,uf,v)+ws*samp(st,us,v)+5e-4)/(wf+ws+1e-3)
outs=[]
for yaw in (0,0.6,1.5707):
    c,s=np.cos(yaw),np.sin(yaw); R=np.array([[c,0,s],[0,1,0],[-s,0,c]])
    p=pts@R.T; n=nrm@R.T
    img=np.zeros((900,700),np.float32); z=np.full(img.shape,-9.)
    X=(p[:,0]*430+350).astype(int); Y=(560-(p[:,1]+0.35)*430).astype(int)
    for i in np.flatnonzero((n[:,2]>-0.15)&(X>=0)&(X<700)&(Y>=0)&(Y<900)):
        if p[i,2]>z[Y[i],X[i]]: z[Y[i],X[i]]=p[i,2]; img[Y[i],X[i]]=min(1,tone[i]*1.5)*(0.5+0.5*max(n[i,2],0))
    outs.append(cv2.dilate(img,np.ones((3,3))))
d=ROOT/'tools/_debug'; d.mkdir(exist_ok=True)
cv2.imwrite(str(d/'prev_all.png'),(np.clip(np.hstack(outs),0,1)*255).astype(np.uint8))
